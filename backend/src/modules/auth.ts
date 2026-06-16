import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import { fetchFacebookProfile } from '../lib/facebook'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import { UserDTO } from '../types/dto'

const router = Router()

function toUserDTO(user: { id: string; name: string; email: string; phone?: string | null }): UserDTO {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone ?? undefined }
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new AppError('An account with this email already exists', 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, passwordHash } })

    res.status(201).json({ token: signToken(user.id), user: toUserDTO(user) })
  })
)

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401)
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new AppError('Invalid email or password', 401)
    }

    res.json({ token: signToken(user.id), user: toUserDTO(user) })
  })
)

const facebookSchema = z.object({
  accessToken: z.string().min(1),
})

router.post(
  '/facebook',
  asyncHandler(async (req, res) => {
    const { accessToken } = facebookSchema.parse(req.body)
    const profile = await fetchFacebookProfile(accessToken)

    let user = await prisma.user.findUnique({ where: { facebookId: profile.id } })

    if (!user && profile.email) {
      const existing = await prisma.user.findUnique({ where: { email: profile.email } })
      if (existing) {
        user = await prisma.user.update({ where: { id: existing.id }, data: { facebookId: profile.id } })
      }
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email ?? `fb_${profile.id}@facebook.fairepart`,
          facebookId: profile.id,
        },
      })
    }

    res.json({ token: signToken(user.id), user: toUserDTO(user) })
  })
)

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user) {
      throw new AppError('User not found', 404)
    }
    res.json({ user: toUserDTO(user) })
  })
)

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
})

router.patch(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const data = updateMeSchema.parse(req.body)
    const user = await prisma.user.update({ where: { id: req.userId }, data })
    res.json({ user: toUserDTO(user) })
  })
)

export default router
