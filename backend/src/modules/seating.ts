import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import { AppError } from '../middleware/errorHandler'
import { toGuestDTO, toTableDTO } from '../serializers'

const router = Router({ mergeParams: true })

const tableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  shape: z.enum(['round', 'rectangular']).optional(),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
})

const updateTableSchema = tableSchema.partial()

const assignSchema = z.object({
  guestId: z.string().min(1),
  tableId: z.string().nullable(),
})

// ─── Tables ────────────────────────────────────────────

router.get(
  '/tables',
  asyncHandler(async (req, res) => {
    const tables = await prisma.seatingTable.findMany({
      where: { eventId: req.eventRecord!.id },
      include: { guests: true },
      orderBy: { name: 'asc' },
    })

    res.json(tables.map(toTableDTO))
  })
)

router.post(
  '/tables',
  asyncHandler(async (req, res) => {
    const data = tableSchema.parse(req.body)

    const table = await prisma.seatingTable.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        shape: data.shape,
        positionX: data.position?.x,
        positionY: data.position?.y,
        eventId: req.eventRecord!.id,
      },
      include: { guests: true },
    })

    res.status(201).json(toTableDTO(table))
  })
)

router.patch(
  '/tables/:tableId',
  asyncHandler(async (req, res) => {
    const data = updateTableSchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const existing = await prisma.seatingTable.findFirst({
      where: { id: req.params.tableId, eventId },
    })
    if (!existing) throw new AppError('Table not found', 404)

    const { position, ...rest } = data

    const table = await prisma.seatingTable.update({
      where: { id: existing.id },
      data: {
        ...rest,
        ...(position ? { positionX: position.x, positionY: position.y } : {}),
      },
      include: { guests: true },
    })

    res.json(toTableDTO(table))
  })
)

router.delete(
  '/tables/:tableId',
  asyncHandler(async (req, res) => {
    const eventId = req.eventRecord!.id

    const existing = await prisma.seatingTable.findFirst({
      where: { id: req.params.tableId, eventId },
    })
    if (!existing) throw new AppError('Table not found', 404)

    await prisma.$transaction([
      prisma.guest.updateMany({ where: { tableId: existing.id }, data: { tableId: null } }),
      prisma.seatingTable.delete({ where: { id: existing.id } }),
    ])

    res.status(204).send()
  })
)

// ─── Guest assignment ──────────────────────────────────

router.patch(
  '/assign',
  asyncHandler(async (req, res) => {
    const { guestId, tableId } = assignSchema.parse(req.body)
    const eventId = req.eventRecord!.id

    const guest = await prisma.guest.findFirst({ where: { id: guestId, eventId } })
    if (!guest) throw new AppError('Guest not found', 404)

    if (tableId) {
      const table = await prisma.seatingTable.findFirst({
        where: { id: tableId, eventId },
        include: { _count: { select: { guests: true } } },
      })
      if (!table) throw new AppError('Table not found', 404)

      if (table._count.guests >= table.capacity && guest.tableId !== tableId) {
        throw new AppError('Table is at full capacity', 409)
      }
    }

    const updated = await prisma.guest.update({
      where: { id: guestId },
      data: { tableId },
      include: { _count: { select: { photos: true } } },
    })

    res.json(toGuestDTO(updated))
  })
)

export default router
