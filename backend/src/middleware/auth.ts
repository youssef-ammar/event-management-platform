import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../lib/jwt'
import { AppError } from './errorHandler'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Missing or invalid Authorization header', 401)
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.userId = payload.sub
    next()
  } catch {
    throw new AppError('Invalid or expired token', 401)
  }
}
