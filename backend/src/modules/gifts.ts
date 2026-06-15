import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createNotification } from '../lib/activity'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { toGiftDTO } from '../serializers'

const router = Router({ mergeParams: true })

export const giftInclude = { reservedByGuest: true } as const

const giftSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  price: z.number().positive().optional(),
  link: z.string().optional(),
})

const updateGiftSchema = giftSchema.partial().extend({
  status: z.enum(['disponible', 'reserve', 'offert']).optional(),
})

const reserveSchema = z.object({
  reservedByName: z.string().min(1),
  reservedByGuestId: z.string().optional(),
})

// ─── List / create ────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const gifts = await prisma.giftItem.findMany({
      where: { eventId: req.eventRecord!.id },
      include: giftInclude,
      orderBy: { name: 'asc' },
    })

    res.json(gifts.map(toGiftDTO))
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = giftSchema.parse(req.body)

    const gift = await prisma.giftItem.create({
      data: { ...data, eventId: req.eventRecord!.id },
      include: giftInclude,
    })

    res.status(201).json(toGiftDTO(gift))
  })
)

// ─── Single gift ───────────────────────────────────────

router.patch(
  '/:giftId',
  asyncHandler(async (req, res) => {
    const data = updateGiftSchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const existing = await prisma.giftItem.findFirst({ where: { id: req.params.giftId, eventId } })
    if (!existing) throw new AppError('Gift not found', 404)

    const gift = await prisma.giftItem.update({
      where: { id: existing.id },
      data,
      include: giftInclude,
    })

    res.json(toGiftDTO(gift))
  })
)

router.delete(
  '/:giftId',
  asyncHandler(async (req, res) => {
    const existing = await prisma.giftItem.findFirst({
      where: { id: req.params.giftId, eventId: req.eventRecord!.id },
    })
    if (!existing) throw new AppError('Gift not found', 404)

    await prisma.giftItem.delete({ where: { id: existing.id } })
    res.status(204).send()
  })
)

// ─── Reserve / unreserve (also reused by public invite routes) ──

export const reserveGift = asyncHandler(async (req, res) => {
  const { reservedByName, reservedByGuestId } = reserveSchema.parse(req.body)
  const eventId = req.eventRecord!.id

  const existing = await prisma.giftItem.findFirst({ where: { id: req.params.giftId, eventId } })
  if (!existing) throw new AppError('Gift not found', 404)
  if (existing.status !== 'disponible') throw new AppError('Gift is no longer available', 409)

  if (reservedByGuestId) {
    const guest = await prisma.guest.findFirst({ where: { id: reservedByGuestId, eventId } })
    if (!guest) throw new AppError('Guest not found', 404)
  }

  const gift = await prisma.giftItem.update({
    where: { id: existing.id },
    data: { status: 'reserve', reservedByName, reservedByGuestId, reservedAt: new Date() },
    include: giftInclude,
  })

  await createNotification(eventId, 'gift', 'Cadeau réservé', `${reservedByName} a réservé "${gift.name}"`)

  res.json(toGiftDTO(gift))
})

router.post('/:giftId/reserve', reserveGift)

router.post(
  '/:giftId/unreserve',
  asyncHandler(async (req, res) => {
    const eventId = req.eventRecord!.id

    const existing = await prisma.giftItem.findFirst({ where: { id: req.params.giftId, eventId } })
    if (!existing) throw new AppError('Gift not found', 404)

    const gift = await prisma.giftItem.update({
      where: { id: existing.id },
      data: { status: 'disponible', reservedByName: null, reservedByGuestId: null, reservedAt: null },
      include: giftInclude,
    })

    res.json(toGiftDTO(gift))
  })
)

export default router
