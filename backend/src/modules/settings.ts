import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import { toSettingsDTO } from '../serializers'

const router = Router({ mergeParams: true })

const updateSettingsSchema = z.object({
  notifEmail: z.boolean().optional(),
  notifSMS: z.boolean().optional(),
  notifRSVP: z.boolean().optional(),
  notifPhoto: z.boolean().optional(),
  notifGift: z.boolean().optional(),
  photoApproval: z.boolean().optional(),
  publicAlbum: z.boolean().optional(),
  showGuestList: z.boolean().optional(),
  language: z.string().min(1).optional(),
  theme: z.string().min(1).optional(),
  guestLimit: z.number().int().positive().nullable().optional(),
})

function toPrismaData(data: z.infer<typeof updateSettingsSchema>) {
  const { notifSMS, notifRSVP, ...rest } = data
  return {
    ...rest,
    ...(notifSMS !== undefined ? { notifSms: notifSMS } : {}),
    ...(notifRSVP !== undefined ? { notifRsvp: notifRSVP } : {}),
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const eventId = req.eventRecord!.id

    const settings = await prisma.eventSettings.upsert({
      where: { eventId },
      create: { eventId },
      update: {},
    })

    res.json(toSettingsDTO(settings))
  })
)

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const eventId = req.eventRecord!.id
    const data = toPrismaData(updateSettingsSchema.parse(req.body))

    const settings = await prisma.eventSettings.upsert({
      where: { eventId },
      create: { eventId, ...data },
      update: data,
    })

    res.json(toSettingsDTO(settings))
  })
)

export default router
