import { Router } from 'express'
import { ActivityAction } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createNotification, logActivity } from '../lib/activity'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { loadEventByToken } from '../middleware/eventAccess'
import { toEventDTO, toGiftDTO, toGuestDTO, toKittyDTO, toMessageDTO } from '../serializers'
import { castVote, messageInclude } from './messages'
import { giftInclude, reserveGift } from './gifts'
import { kittyInclude, addContribution } from './kitties'
import { uploadPhoto } from './photos'

const router = Router({ mergeParams: true })

router.use(loadEventByToken)

const RSVP_STATUSES = ['accepted', 'pending', 'declined'] as const
const EVENT_STEP_TYPES = ['ceremonie', 'mairie', 'reception', 'soiree', 'religieux'] as const

const guestInclude = { _count: { select: { photos: true } } } as const

const rsvpSchema = z.object({
  rsvpStatus: z.enum(RSVP_STATUSES).optional(),
  steps: z.array(z.enum(EVENT_STEP_TYPES)).optional(),
  dietaryRestrictions: z.string().optional(),
})

// ─── Event info ─────────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: req.eventRecord!.id },
      include: { steps: true },
    })

    res.json(await toEventDTO(event))
  })
)

// ─── Guest lookup / RSVP ────────────────────────────────

router.get(
  '/guests',
  asyncHandler(async (req, res) => {
    const { email } = req.query
    if (typeof email !== 'string' || !email.trim()) throw new AppError('Email is required', 400)

    const guest = await prisma.guest.findFirst({
      where: { eventId: req.eventRecord!.id, email: { equals: email, mode: 'insensitive' } },
      include: guestInclude,
    })
    if (!guest) throw new AppError('Guest not found', 404)

    res.json(toGuestDTO(guest))
  })
)

router.patch(
  '/guests/:guestId/rsvp',
  asyncHandler(async (req, res) => {
    const data = rsvpSchema.parse(req.body)
    const eventId = req.eventRecord!.id
    const guestId = req.params.guestId

    const existing = await prisma.guest.findFirst({ where: { id: guestId, eventId } })
    if (!existing) throw new AppError('Guest not found', 404)

    const rsvpChanged = data.rsvpStatus !== undefined && data.rsvpStatus !== existing.rsvpStatus

    const guest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        ...data,
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

// ─── Seating ────────────────────────────────────────────

router.get(
  '/tables',
  asyncHandler(async (req, res) => {
    const tables = await prisma.seatingTable.findMany({
      where: { eventId: req.eventRecord!.id },
      include: { guests: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { name: 'asc' },
    })

    res.json(
      tables.map((t) => ({
        id: t.id,
        name: t.name,
        capacity: t.capacity,
        shape: (t.shape as 'round' | 'rectangular' | null) ?? undefined,
        guests: t.guests,
      }))
    )
  })
)

// ─── Messages & polls ───────────────────────────────────

router.get(
  '/messages',
  asyncHandler(async (req, res) => {
    const messages = await prisma.message.findMany({
      where: { eventId: req.eventRecord!.id, sentAt: { not: null } },
      include: messageInclude,
      orderBy: { sentAt: 'desc' },
    })

    res.json(messages.map(toMessageDTO))
  })
)

router.post('/messages/:messageId/votes', castVote)

// ─── Gifts ──────────────────────────────────────────────

router.get(
  '/gifts',
  asyncHandler(async (req, res) => {
    const gifts = await prisma.giftItem.findMany({
      where: { eventId: req.eventRecord!.id },
      include: giftInclude,
      orderBy: { name: 'asc' },
    })

    res.json(gifts.map(toGiftDTO))
  })
)

router.post('/gifts/:giftId/reserve', reserveGift)

// ─── Kitties ────────────────────────────────────────────

router.get(
  '/kitties',
  asyncHandler(async (req, res) => {
    const kitties = await prisma.kittyGoal.findMany({
      where: { eventId: req.eventRecord!.id },
      include: kittyInclude,
      orderBy: { createdAt: 'desc' },
    })

    res.json(kitties.map(toKittyDTO))
  })
)

router.post('/kitties/:kittyId/contributions', addContribution)

// ─── Photos ─────────────────────────────────────────────

router.post('/photos', ...uploadPhoto)

export default router
