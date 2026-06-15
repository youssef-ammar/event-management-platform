import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate } from '../middleware/auth'
import { loadEvent } from '../middleware/eventAccess'
import { toActivityDTO, toEventDTO } from '../serializers'
import { StatsCardDTO } from '../types/dto'
import guestsRouter from './guests'
import seatingRouter from './seating'
import messagesRouter from './messages'
import photosRouter from './photos'
import giftsRouter from './gifts'
import kittiesRouter from './kitties'
import notificationsRouter from './notifications'
import settingsRouter from './settings'

const router = Router()

router.use(authenticate)

const EVENT_STEP_TYPES = ['ceremonie', 'mairie', 'reception', 'soiree', 'religieux'] as const
const EVENT_TYPES = ['mariage', 'anniversaire', 'naissance', 'autre'] as const

const stepSchema = z.object({
  step: z.enum(EVENT_STEP_TYPES),
  label: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  address: z.string().min(1),
})

const createEventSchema = z.object({
  name: z.string().min(1),
  type: z.enum(EVENT_TYPES),
  date: z.string().min(1),
  venue: z.string().min(1),
  coupleNames: z.string().optional(),
  coverImageUrl: z.string().optional(),
  steps: z.array(stepSchema).default([]),
})

const updateEventSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(EVENT_TYPES).optional(),
  date: z.string().min(1).optional(),
  venue: z.string().min(1).optional(),
  coupleNames: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  steps: z.array(stepSchema).optional(),
})

// ─── List / create ────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const events = await prisma.event.findMany({
      where: { ownerId: req.userId },
      include: { steps: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(await Promise.all(events.map(toEventDTO)))
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createEventSchema.parse(req.body)

    const event = await prisma.event.create({
      data: {
        name: data.name,
        type: data.type,
        date: new Date(data.date),
        venue: data.venue,
        coupleNames: data.coupleNames,
        coverImageUrl: data.coverImageUrl,
        ownerId: req.userId!,
        steps: {
          create: data.steps.map((s) => ({
            step: s.step,
            label: s.label,
            date: new Date(s.date),
            time: s.time,
            address: s.address,
          })),
        },
      },
      include: { steps: true },
    })

    res.status(201).json(await toEventDTO(event))
  })
)

// ─── Single event ──────────────────────────────────────

router.get(
  '/:eventId',
  loadEvent,
  asyncHandler(async (req, res) => {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: req.eventRecord!.id },
      include: { steps: true },
    })

    res.json(await toEventDTO(event))
  })
)

router.patch(
  '/:eventId',
  loadEvent,
  asyncHandler(async (req, res) => {
    const data = updateEventSchema.parse(req.body)
    const { steps, date, ...rest } = data
    const eventId = req.eventRecord!.id

    await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id: eventId },
        data: {
          ...rest,
          ...(date ? { date: new Date(date) } : {}),
        },
      })

      if (steps) {
        await tx.eventStepInfo.deleteMany({ where: { eventId } })
        await tx.eventStepInfo.createMany({
          data: steps.map((s) => ({
            eventId,
            step: s.step,
            label: s.label,
            date: new Date(s.date),
            time: s.time,
            address: s.address,
          })),
        })
      }
    })

    const updated = await prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      include: { steps: true },
    })

    res.json(await toEventDTO(updated))
  })
)

router.delete(
  '/:eventId',
  loadEvent,
  asyncHandler(async (req, res) => {
    await prisma.event.delete({ where: { id: req.eventRecord!.id } })
    res.status(204).send()
  })
)

// ─── Dashboard ─────────────────────────────────────────

router.get(
  '/:eventId/dashboard',
  loadEvent,
  asyncHandler(async (req, res) => {
    const eventId = req.eventRecord!.id

    const [total, accepted, pending, declined, activityLogs] = await Promise.all([
      prisma.guest.count({ where: { eventId } }),
      prisma.guest.count({ where: { eventId, rsvpStatus: 'accepted' } }),
      prisma.guest.count({ where: { eventId, rsvpStatus: 'pending' } }),
      prisma.guest.count({ where: { eventId, rsvpStatus: 'declined' } }),
      prisma.activityLog.findMany({
        where: { eventId },
        include: { guest: true },
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
    ])

    const stats: StatsCardDTO[] = [
      { label: 'Invités totaux', value: total, icon: 'Users', color: 'blue' },
      { label: 'Confirmés', value: accepted, icon: 'CheckCircle', color: 'green' },
      { label: 'En attente', value: pending, icon: 'Clock', color: 'amber' },
      { label: 'Refusés', value: declined, icon: 'XCircle', color: 'red' },
    ]

    res.json({ stats, activity: activityLogs.map(toActivityDTO) })
  })
)

// ─── Nested resources ──────────────────────────────────

router.use('/:eventId/guests', loadEvent, guestsRouter)
router.use('/:eventId/seating', loadEvent, seatingRouter)
router.use('/:eventId/messages', loadEvent, messagesRouter)
router.use('/:eventId/photos', loadEvent, photosRouter)
router.use('/:eventId/gifts', loadEvent, giftsRouter)
router.use('/:eventId/kitties', loadEvent, kittiesRouter)
router.use('/:eventId/notifications', loadEvent, notificationsRouter)
router.use('/:eventId/settings', loadEvent, settingsRouter)

export default router
