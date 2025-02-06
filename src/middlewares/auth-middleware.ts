import { env } from '@/env'
import basicAuth from 'express-basic-auth'

export const authMiddleware = basicAuth({
  users: { [env.ADMIN_USER]: env.ADMIN_PASSWORD },
  challenge: true,
  unauthorizedResponse: 'Invalid credentials',
})
