import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/**
 * Authentication middleware
 * - In production (NODE_ENV=production) verifies JWT using JWT_SECRET
 * - In development, accepts the prototype's unsigned token by decoding the payload
 *   and also allows missing Authorization by assigning a default dev user
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const isProd = process.env.NODE_ENV === 'production'
  const header = req.headers['authorization']

  // In development, allow requests without Authorization and use a default user
    const isDev = process.env.NODE_ENV !== 'production'

    // In development, allow requests without Authorization and attach a default user
    if (!header) {
      if (isDev) {
        req.user = { id: 'dev-user', role: 'Supervisor' }
        return next()
      }
      return res.status(401).json({ success: false, error: 'Missing Authorization header' })
    }

  const token = header.replace('Bearer ', '')

  // If not production, try to decode prototype token (unsigned base64 JWT)
  if (!isProd) {
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8')
        const payload = JSON.parse(payloadJson)
        req.user = { id: payload.sub || 'dev-user', role: payload.role || 'Supervisor' }
        return next()
      }
    } catch {
      // fall through to standard verification below
    }
  }

  // Standard verification path
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET not configured')
      const payload = jwt.verify(token, secret) as any
      req.user = { id: payload.sub ?? 'unknown', role: payload.role ?? 'Supervisor' }
    next()
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

export function requireRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    next()
  }
}
