import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { toKittyDTO } from '../serializers'

const router = Router({ mergeParams: true })

export const kittyInclude = {
  contributors: { orderBy: { contributedAt: 'desc' as const } },
} as const

const kittySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  targetAmount: z.number().positive(),
})

const updateKittySchema = kittySchema.partial().extend({
  isActive: z.boolean().optional(),
})

const contributionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  message: z.string().optional(),
  avatarColor: z.string().optional(),
  guestId: z.string().optional(),
})

// ─── List / create ────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const kitties = await prisma.kittyGoal.findMany({
      where: { eventId: req.eventRecord!.id },
      include: kittyInclude,
      orderBy: { createdAt: 'desc' },
    })

    res.json(kitties.map(toKittyDTO))
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = kittySchema.parse(req.body)

    const kitty = await prisma.kittyGoal.create({
      data: { ...data, eventId: req.eventRecord!.id },
      include: kittyInclude,
    })

    res.status(201).json(toKittyDTO(kitty))
  })
)

// ─── Single goal ───────────────────────────────────────

router.patch(
  '/:kittyId',
  asyncHandler(async (req, res) => {
    const data = updateKittySchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const existing = await prisma.kittyGoal.findFirst({ where: { id: req.params.kittyId, eventId } })
    if (!existing) throw new AppError('Kitty not found', 404)

    const kitty = await prisma.kittyGoal.update({
      where: { id: existing.id },
      data,
      include: kittyInclude,
    })

    res.json(toKittyDTO(kitty))
  })
)

router.delete(
  '/:kittyId',
  asyncHandler(async (req, res) => {
    const existing = await prisma.kittyGoal.findFirst({
      where: { id: req.params.kittyId, eventId: req.eventRecord!.id },
    })
    if (!existing) throw new AppError('Kitty not found', 404)

    await prisma.kittyGoal.delete({ where: { id: existing.id } })
    res.status(204).send()
  })
)

// ─── Contributions (also reused by public invite routes) ──

export const addContribution = asyncHandler(async (req, res) => {
  const data = contributionSchema.parse(req.body)
  const eventId = req.eventRecord!.id

  const existing = await prisma.kittyGoal.findFirst({ where: { id: req.params.kittyId, eventId } })
  if (!existing) throw new AppError('Kitty not found', 404)

  if (data.guestId) {
    const guest = await prisma.guest.findFirst({ where: { id: data.guestId, eventId } })
    if (!guest) throw new AppError('Guest not found', 404)
  }

  const kitty = await prisma.kittyGoal.update({
    where: { id: existing.id },
    data: {
      currentAmount: { increment: data.amount },
      contributors: {
        create: {
          name: data.name,
          amount: data.amount,
          message: data.message,
          avatarColor: data.avatarColor,
          guestId: data.guestId,
        },
      },
    },
    include: kittyInclude,
  })

  res.status(201).json(toKittyDTO(kitty))
})

router.post('/:kittyId/contributions', addContribution)

export default router
