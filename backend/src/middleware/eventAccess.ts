import { prisma } from '../lib/prisma'
import { AppError } from './errorHandler'
import { asyncHandler } from './asyncHandler'

/** Loads `req.params.eventId`, ensuring it exists and belongs to the authenticated user. */
export const loadEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params

  const event = await prisma.event.findUnique({ where: { id: eventId } })

  if (!event || event.ownerId !== req.userId) {
    throw new AppError('Event not found', 404)
  }

  req.eventRecord = event
  next()
})

/** Loads `req.params.token` for public, guest-facing invite routes. */
export const loadEventByToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params

  const event = await prisma.event.findUnique({ where: { token } })

  if (!event) {
    throw new AppError('Invitation not found', 404)
  }

  req.eventRecord = event
  next()
})
