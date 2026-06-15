import type { Event as PrismaEvent } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      eventRecord?: PrismaEvent
    }
  }
}

export {}
