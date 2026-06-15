import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { toMessageDTO } from '../serializers'

const router = Router({ mergeParams: true })

const EVENT_STEP_TYPES = ['ceremonie', 'mairie', 'reception', 'soiree', 'religieux'] as const

export const messageInclude = {
  poll: {
    include: {
      options: {
        include: {
          votes: { include: { guest: true } },
        },
      },
    },
  },
} as const

const pollSchema = z.object({
  question: z.string().min(1),
  isAnonymous: z.boolean().default(false),
  options: z.array(z.string().min(1)).min(2),
})

const createMessageSchema = z.object({
  type: z.enum(['message', 'sondage']),
  content: z.string().min(1),
  steps: z.array(z.enum(EVENT_STEP_TYPES)).optional(),
  scheduledAt: z.string().optional(),
  poll: pollSchema.optional(),
})

const voteSchema = z.object({
  guestId: z.string().min(1),
  optionId: z.string().min(1),
})

// ─── List / create ────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const messages = await prisma.message.findMany({
      where: { eventId: req.eventRecord!.id },
      include: messageInclude,
      orderBy: { createdAt: 'desc' },
    })

    res.json(messages.map(toMessageDTO))
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createMessageSchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const recipientCount = data.steps?.length
      ? await prisma.guest.count({ where: { eventId, steps: { hasSome: data.steps } } })
      : await prisma.guest.count({ where: { eventId } })

    const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null
    const sentAt = scheduledAt && scheduledAt > new Date() ? null : new Date()

    const message = await prisma.message.create({
      data: {
        type: data.type,
        content: data.content,
        steps: data.steps ?? [],
        scheduledAt,
        sentAt,
        recipientCount,
        eventId,
        poll: data.poll
          ? {
              create: {
                question: data.poll.question,
                isAnonymous: data.poll.isAnonymous,
                options: { create: data.poll.options.map((text) => ({ text })) },
              },
            }
          : undefined,
      },
      include: messageInclude,
    })

    res.status(201).json(toMessageDTO(message))
  })
)

// ─── Single message ────────────────────────────────────

router.get(
  '/:messageId',
  asyncHandler(async (req, res) => {
    const message = await prisma.message.findFirst({
      where: { id: req.params.messageId, eventId: req.eventRecord!.id },
      include: messageInclude,
    })
    if (!message) throw new AppError('Message not found', 404)

    res.json(toMessageDTO(message))
  })
)

router.delete(
  '/:messageId',
  asyncHandler(async (req, res) => {
    const message = await prisma.message.findFirst({
      where: { id: req.params.messageId, eventId: req.eventRecord!.id },
    })
    if (!message) throw new AppError('Message not found', 404)

    await prisma.message.delete({ where: { id: message.id } })
    res.status(204).send()
  })
)

// ─── Poll voting ───────────────────────────────────────

export const castVote = asyncHandler(async (req, res) => {
  const { guestId, optionId } = voteSchema.parse(req.body)
  const eventId = req.eventRecord!.id
  const messageId = req.params.messageId

  const message = await prisma.message.findFirst({
    where: { id: messageId, eventId },
    include: { poll: true },
  })
  if (!message || !message.poll) throw new AppError('Poll not found', 404)

  const option = await prisma.pollOption.findFirst({
    where: { id: optionId, pollId: message.poll.id },
  })
  if (!option) throw new AppError('Poll option not found', 404)

  const guest = await prisma.guest.findFirst({ where: { id: guestId, eventId } })
  if (!guest) throw new AppError('Guest not found', 404)

  await prisma.pollVote.upsert({
    where: { pollId_guestId: { pollId: message.poll.id, guestId } },
    update: { optionId },
    create: { pollId: message.poll.id, optionId, guestId },
  })

  const updated = await prisma.message.findUniqueOrThrow({
    where: { id: messageId },
    include: messageInclude,
  })

  res.json(toMessageDTO(updated))
})

router.post('/:messageId/votes', castVote)

export default router
