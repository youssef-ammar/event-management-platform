import crypto from 'crypto'
import path from 'path'
import multer from 'multer'
import { AppError } from './errorHandler'

const UPLOAD_DIR = path.join(__dirname, '../../uploads')

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new AppError('Only JPEG, PNG, WEBP or GIF images are allowed', 400))
      return
    }
    cb(null, true)
  },
})

export const UPLOADS_DIR = UPLOAD_DIR
