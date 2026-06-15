import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { UPLOADS_DIR } from './middleware/upload'
import authRouter from './modules/auth'
import eventsRouter from './modules/events'
import inviteRouter from './modules/invite'
import invitationStylesRouter from './modules/invitationStyles'

const app = express()

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({ origin: env.corsOrigin }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/uploads', express.static(UPLOADS_DIR))

app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter)
app.use('/api/invite/:token', inviteRouter)
app.use('/api/invitation-styles', invitationStylesRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
