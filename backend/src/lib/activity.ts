import { ActivityAction, NotificationType } from '@prisma/client'
import { prisma } from './prisma'

export function logActivity(eventId: string, guestId: string, action: ActivityAction) {
  return prisma.activityLog.create({
    data: { eventId, guestId, action },
  })
}

export function createNotification(
  eventId: string,
  type: NotificationType,
  title: string,
  body: string
) {
  return prisma.notification.create({
    data: { eventId, type, title, body },
  })
}
