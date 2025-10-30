# Services (Backend Modules)

This folder contains all backend modules, API services, and server-side code for the AMLGuard system.

## 📁 Folder Structure

```
services/
├── README.md (this file)
├── api/                          # API endpoints and routes
│   ├── auth/                    # Authentication endpoints
│   ├── entities/                # Entity management endpoints
│   ├── dashboard/               # Dashboard data endpoints
│   └── compliance/              # Compliance endpoints
├── middleware/                   # Express/server middleware
│   ├── auth.middleware.ts       # Authentication middleware
│   ├── errorHandler.ts          # Error handling middleware
│   └── logging.ts               # Request logging
├── models/                       # Database models/schemas
│   ├── User.ts
│   ├── Entity.ts
│   ├── Transaction.ts
│   └── Compliance.ts
├── services/                     # Business logic services
│   ├── authService.ts           # Authentication logic
│   ├── entityService.ts         # Entity management logic
│   ├── complianceService.ts     # Compliance checking
│   └── reportService.ts         # Report generation
├── controllers/                  # Request handlers
│   ├── authController.ts
│   ├── entityController.ts
│   ├── dashboardController.ts
│   └── complianceController.ts
├── utils/                        # Utility functions
│   ├── validators.ts            # Data validation
│   ├── helpers.ts               # Helper functions
│   ├── constants.ts             # Constants
│   └── errors.ts                # Custom error classes
├── config/                       # Configuration files
│   ├── database.ts              # Database configuration
│   ├── env.ts                   # Environment variables
│   └── security.ts              # Security configuration
├── tests/                        # Backend tests
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data and fixtures
├── migrations/                   # Database migrations
├── seeds/                        # Database seeders
├── package.json                 # Backend dependencies
├── tsconfig.json                # TypeScript config
└── .env.example                 # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ LTS
- npm, yarn, or pnpm

### Installation

```bash
cd services
npm install    # or pnpm install / yarn install
```

### Available Scripts

```bash
# Development
npm run dev                 # Start development server

# Building
npm run build              # Build for production

# Testing
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# Database
npm run migrate            # Run database migrations
npm run seed              # Seed database with test data

# Linting & Formatting
npm run lint              # Lint code
npm run format            # Format code with Prettier
```

## 📝 Development Guidelines

### Code Style
- Use **TypeScript** for type safety
- Follow **ESLint** rules
- Format with **Prettier**
- 80% minimum test coverage

### API Standards
- RESTful API design
- Consistent error responses
- API versioning (if needed)
- Request/response validation

### Database
- Use migrations for schema changes
- Seed test data for development
- Document relationships
- Implement proper indexing

### Security
- Validate all inputs
- Sanitize data before storage
- Hash passwords (bcrypt)
- Use JWT for authentication
- Implement rate limiting
- Add CORS configuration

## 🔄 Git Workflow

### Creating a Feature

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat(scope): description"

# Push branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Format

```
feat(auth): add JWT token refresh
fix(entity): resolve validation error
docs(api): update endpoint documentation
test(service): add unit tests for email service
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code

### Entity Endpoints
- `GET /api/entities` - List all entities
- `GET /api/entities/:id` - Get entity details
- `POST /api/entities` - Create new entity
- `PUT /api/entities/:id` - Update entity
- `DELETE /api/entities/:id` - Delete entity

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/alerts` - Recent alerts
- `GET /api/dashboard/activities` - Activity feed
- `GET /api/dashboard/compliance-status` - Compliance overview

### Compliance Endpoints
- `GET /api/compliance/reports` - List compliance reports
- `POST /api/compliance/assessment` - Run compliance assessment
- `GET /api/compliance/deficiencies` - List deficiencies
- `PUT /api/compliance/deficiencies/:id` - Update deficiency status

## 🧪 Testing

### Unit Tests
```bash
npm run test -- auth.service.spec.ts
```

### Integration Tests
```bash
npm run test:integration
```

### Coverage Report
```bash
npm run test:coverage
```

## 🐛 Common Issues

### Database Connection Failed
- Check `.env` file has correct DB credentials
- Ensure database server is running
- Verify network connectivity

### Tests Failing
- Clear `node_modules` and reinstall
- Check test database is available
- Run migrations before tests

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

## 📞 Support & Questions

- Check [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines
- Review [DEVELOPMENT.md](../DEVELOPMENT.md) for setup
- Ask team members on GitHub Discussions
- Create issue if you find bugs

## 🔐 Security Reminders

⚠️ **IMPORTANT:**
- Never commit `.env` files with real secrets
- Use `.env.example` for configuration template
- Keep dependencies updated
- Review security fixes regularly
- Validate all user inputs
- Use HTTPS in production

## 📋 Checklist for New Endpoints

- [ ] Created in appropriate controller
- [ ] Added validation middleware
- [ ] Wrote unit tests (80%+)
- [ ] Added error handling
- [ ] Documented in this README
- [ ] Updated API documentation
- [ ] Tested with real data
- [ ] Created PR and requested review

---

**Last Updated:** October 30, 2025
**Status:** Ready for Backend Development
