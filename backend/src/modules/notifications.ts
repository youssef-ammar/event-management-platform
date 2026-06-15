import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { toNotificationDTO } from '../serializers'

const router = Router({ mergeParams: true })

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { eventId: req.eventRecord!.id },
      orderBy: { createdAt: 'desc' },
    })

    res.json(notifications.map(toNotificationDTO))
  })
)

router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { eventId: req.eventRecord!.id, read: false },
      data: { read: true },
    })

    res.status(204).send()
  })
)

router.patch(
  '/:notificationId/read',
  asyncHandler(async (req, res) => {
    const existing = await prisma.notification.findFirst({
      where: { id: req.params.notificationId, eventId: req.eventRecord!.id },
    })
    if (!existing) throw new AppError('Notification not found', 404)

    const notification = await prisma.notification.update({
      where: { id: existing.id },
      data: { read: true },
    })

    res.json(toNotificationDTO(notification))
  })
)

export default router
