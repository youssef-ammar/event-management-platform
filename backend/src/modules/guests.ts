import { Router } from 'express'
import { Prisma, ActivityAction } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createNotification, logActivity } from '../lib/activity'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { toGuestDTO } from '../serializers'

const router = Router({ mergeParams: true })

const RSVP_STATUSES = ['accepted', 'pending', 'declined'] as const
const EVENT_STEP_TYPES = ['ceremonie', 'mairie', 'reception', 'soiree', 'religieux'] as const

const guestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  rsvpStatus: z.enum(RSVP_STATUSES).default('pending'),
  steps: z.array(z.enum(EVENT_STEP_TYPES)).default([]),
  familyGroup: z.string().optional(),
  relatedGuests: z.array(z.string()).optional(),
  avatarColor: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
})

const updateGuestSchema = guestSchema.partial().extend({
  tableId: z.string().nullable().optional(),
})

const guestInclude = { _count: { select: { photos: true } } } as const

// ─── List / create ────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { rsvpStatus, step, search, familyGroup } = req.query
    const eventId = req.eventRecord!.id

    const where: Prisma.GuestWhereInput = { eventId }

    if (typeof rsvpStatus === 'string') where.rsvpStatus = rsvpStatus as (typeof RSVP_STATUSES)[number]
    if (typeof step === 'string') where.steps = { has: step as (typeof EVENT_STEP_TYPES)[number] }
    if (typeof familyGroup === 'string') where.familyGroup = familyGroup

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const guests = await prisma.guest.findMany({
      where,
      include: guestInclude,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    })

    res.json(guests.map(toGuestDTO))
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { relatedGuests, ...data } = guestSchema.parse(req.body)

    const guest = await prisma.guest.create({
      data: {
        ...data,
        relatedGuestIds: relatedGuests ?? [],
        eventId: req.eventRecord!.id,
        respondedAt: data.rsvpStatus !== 'pending' ? new Date() : null,
      },
      include: guestInclude,
    })

    res.status(201).json(toGuestDTO(guest))
  })
)

const importSchema = z.array(guestSchema)

router.post(
  '/import',
  asyncHandler(async (req, res) => {
    const items = importSchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const created = await prisma.$transaction(
      items.map(({ relatedGuests, ...data }) =>
        prisma.guest.create({
          data: {
            ...data,
            relatedGuestIds: relatedGuests ?? [],
            eventId,
            respondedAt: data.rsvpStatus !== 'pending' ? new Date() : null,
          },
        })
      )
    )

    res.status(201).json(created.map((g) => toGuestDTO(g)))
  })
)

// ─── Single guest ──────────────────────────────────────

router.get(
  '/:guestId',
  asyncHandler(async (req, res) => {
    const guest = await prisma.guest.findFirst({
      where: { id: req.params.guestId, eventId: req.eventRecord!.id },
      include: guestInclude,
    })
    if (!guest) throw new AppError('Guest not found', 404)

    res.json(toGuestDTO(guest))
  })
)

router.patch(
  '/:guestId',
  asyncHandler(async (req, res) => {
    const { relatedGuests, tableId, ...data } = updateGuestSchema.parse(req.body)
    const eventId = req.eventRecord!.id
    const guestId = req.params.guestId

    const existing = await prisma.guest.findFirst({ where: { id: guestId, eventId } })
    if (!existing) throw new AppError('Guest not found', 404)

    const rsvpChanged = data.rsvpStatus !== undefined && data.rsvpStatus !== existing.rsvpStatus

    const guest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        ...data,
        ...(relatedGuests !== undefined ? { relatedGuestIds: relatedGuests } : {}),
        ...(tableId !== undefined ? { tableId } : {}),
        ...(rsvpChanged ? { respondedAt: new Date() } : {}),
      },
      include: guestInclude,
    })

    if (rsvpChanged) {
      await logActivity(eventId, guestId, data.rsvpStatus as ActivityAction)

      if (data.rsvpStatus === 'accepted') {
        await createNotification(
          eventId,
          'rsvp',
          'Nouvelle réponse RSVP',
          `${guest.firstName} ${guest.lastName} a accepté votre invitation`
        )
      } else if (data.rsvpStatus === 'declined') {
        await createNotification(
          eventId,
          'rsvp',
          'Refus RSVP',
          `${guest.firstName} ${guest.lastName} ne pourra pas assister`
        )
      }
    }

    res.json(toGuestDTO(guest))
  })
)

router.delete(
  '/:guestId',
  asyncHandler(async (req, res) => {
    const guest = await prisma.guest.findFirst({
      where: { id: req.params.guestId, eventId: req.eventRecord!.id },
    })
    if (!guest) throw new AppError('Guest not found', 404)

    await prisma.guest.delete({ where: { id: guest.id } })
    res.status(204).send()
  })
)

export default router
