import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createNotification } from '../lib/activity'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { upload, UPLOADS_DIR } from '../middleware/upload'
import { toPhotoDTO } from '../serializers'

const router = Router({ mergeParams: true })

const photoInclude = { guest: true } as const

const uploadBodySchema = z.object({ guestId: z.string().min(1) })
const updatePhotoSchema = z.object({ approved: z.boolean() })

// ─── List ──────────────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { approved } = req.query
    const where: Prisma.PhotoWhereInput = { eventId: req.eventRecord!.id }

    if (approved === 'true') where.approved = true
    else if (approved === 'false') where.approved = false

    const photos = await prisma.photo.findMany({
      where,
      include: photoInclude,
      orderBy: { uploadedAt: 'desc' },
    })

    res.json(photos.map(toPhotoDTO))
  })
)

// ─── Upload (also reused by the public invite routes) ──

export const uploadPhoto = [
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const { guestId } = uploadBodySchema.parse(req.body)
    const eventId = req.eventRecord!.id

    if (!req.file) throw new AppError('No file uploaded', 400)

    const guest = await prisma.guest.findFirst({ where: { id: guestId, eventId } })
    if (!guest) throw new AppError('Guest not found', 404)

    const dimensions = sizeOf(req.file.path)
    const url = `/uploads/${req.file.filename}`

    const photo = await prisma.photo.create({
      data: {
        url,
        thumbnailUrl: url,
        width: dimensions.width ?? 0,
        height: dimensions.height ?? 0,
        guestId,
        eventId,
      },
      include: photoInclude,
    })

    await createNotification(
      eventId,
      'photo',
      'Nouvelle photo',
      `${guest.firstName} ${guest.lastName} a ajouté une photo`
    )

    res.status(201).json(toPhotoDTO(photo))
  }),
]

router.post('/', ...uploadPhoto)

// ─── Approve / delete ──────────────────────────────────

router.patch(
  '/:photoId',
  asyncHandler(async (req, res) => {
    const { approved } = updatePhotoSchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const existing = await prisma.photo.findFirst({ where: { id: req.params.photoId, eventId } })
    if (!existing) throw new AppError('Photo not found', 404)

    const photo = await prisma.photo.update({
      where: { id: existing.id },
      data: { approved },
      include: photoInclude,
    })

    res.json(toPhotoDTO(photo))
  })
)

router.delete(
  '/:photoId',
  asyncHandler(async (req, res) => {
    const eventId = req.eventRecord!.id

    const existing = await prisma.photo.findFirst({ where: { id: req.params.photoId, eventId } })
    if (!existing) throw new AppError('Photo not found', 404)

    await prisma.photo.delete({ where: { id: existing.id } })

    const filePath = path.join(UPLOADS_DIR, path.basename(existing.url))
    fs.promises.unlink(filePath).catch(() => undefined)

    res.status(204).send()
  })
)

export default router
