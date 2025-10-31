import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { authenticate } from './middleware/auth.js'
import { audit } from './middleware/audit.js'
import institutionsRoute from './routes/institutions.js'
import riskProfilesRoute from './routes/riskProfiles.js'
import surveillanceRoute from './routes/surveillance.js'
import inspectionsRoute from './routes/inspections.js'
import riskAssessmentRoute from './routes/riskAssessment.js'
import dashboardRoute from './routes/dashboard.js'

const app: express.Express = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan(process.env.LOG_LEVEL || 'dev'))
app.use(rateLimit({ windowMs: 60_000, max: 300 }))

// Swagger UI and spec endpoint (inline minimal spec)
const openapi: any = {
  openapi: '3.0.3',
  info: { title: 'Supervision Module API', version: '0.1.0' },
  servers: [{ url: 'http://localhost:' + (process.env.PORT || 4001) }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } },
      },
    },
  },
}
app.get('/api/openapi.json', (_req, res) => res.json(openapi))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi))

// Health
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }))

// Protected routes
app.use('/api', authenticate, audit)
app.use('/api/institutions', institutionsRoute)
app.use('/api/risk-profiles', riskProfilesRoute)
app.use('/api/surveillance', surveillanceRoute)
app.use('/api/inspections', inspectionsRoute)
app.use('/api/risk-assessment', riskAssessmentRoute)
app.use('/api/dashboard', dashboardRoute)

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, error: 'Internal Server Error' })
})

export default app
