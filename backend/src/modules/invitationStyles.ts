import { Router } from 'express'
import { INVITATION_STYLES } from '../data/invitationStyles'

const router = Router()

router.get('/', (_req, res) => {
  res.json(INVITATION_STYLES)
})

export default router
