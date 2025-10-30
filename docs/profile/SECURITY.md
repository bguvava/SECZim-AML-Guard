# Security Best Practices

Security considerations and best practices for the Profile module.

## Overview

The Profile module handles sensitive user data including personal information, passwords, authentication settings, and activity logs. Security must be a top priority.

## Password Security

### Password Requirements

**Minimum Requirements:**
- 8+ characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

**Best Practices:**
- Recommend 12+ characters for "Very Strong" rating
- Encourage use of password managers
- Prohibit common passwords (check against breach databases)
- Enforce password history (don't reuse last 5 passwords)

### Password Storage

**Never store passwords in plain text:**

```typescript
// ❌ NEVER DO THIS
const password = user.password

// ✅ ALWAYS HASH
import bcrypt from 'bcrypt'

const hashedPassword = await bcrypt.hash(password, 12)
// Store hashedPassword in database
```

### Password Transmission

**Always use HTTPS:**
- All API endpoints must use TLS/SSL
- Never send passwords via URL parameters
- Use POST requests for password changes

```typescript
// ✅ Correct
await fetch('/api/change-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    currentPassword, 
    newPassword 
  })
})

// ❌ NEVER
await fetch(`/api/change-password?password=${password}`)
```

## Two-Factor Authentication

### Implementation

**TOTP (Authenticator App) - Recommended:**
- Use standard TOTP algorithm (RFC 6238)
- Generate 6-digit codes
- 30-second time window
- QR code for easy setup

```typescript
import { authenticator } from 'otplib'

// Generate secret
const secret = authenticator.generateSecret()

// Generate QR code URL
const otpauthUrl = authenticator.keyuri(
  userEmail,
  'AMLGuard',
  secret
)

// Verify code
const isValid = authenticator.verify({
  token: userCode,
  secret: secret
})
```

### Backup Codes

**Generate securely:**
```typescript
import crypto from 'crypto'

function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(code)
  }
  return codes
}

// Hash before storing
const hashedCodes = codes.map(code => bcrypt.hash(code, 12))
```

**Best Practices:**
- Generate 10 single-use codes
- Hash codes before storing
- Mark as used after verification
- Allow regeneration with password confirmation

### 2FA Enforcement

**For privileged roles:**
```typescript
const requires2FA = (user: UserProfile): boolean => {
  return user.role === 'admin' || user.role === 'supervisor'
}

if (requires2FA(user) && !user.twoFactorEnabled) {
  // Force 2FA setup
  router.push('/setup-2fa')
}
```

## Session Management

### Secure Session Handling

**Session tokens:**
- Use cryptographically secure random tokens
- Store hashed in database
- Include expiration timestamp
- Rotate on privilege escalation

```typescript
import crypto from 'crypto'

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

interface SessionData {
  token: string // Hashed
  userId: string
  deviceInfo: DeviceInfo
  ipAddress: string
  createdAt: Date
  expiresAt: Date
  lastActivity: Date
}
```

### Session Revocation

**Track all sessions:**
- Store device information
- Log IP addresses and locations
- Allow users to revoke any session
- Automatically expire after inactivity

```typescript
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

function isSessionExpired(session: SessionData): boolean {
  const now = Date.now()
  const lastActivity = new Date(session.lastActivity).getTime()
  return (now - lastActivity) > SESSION_TIMEOUT
}
```

### Suspicious Activity Detection

```typescript
function detectSuspiciousLogin(user: UserProfile, newSession: Session): boolean {
  const lastSession = user.sessions[0]
  
  // Check for unusual location change
  if (lastSession && lastSession.location.country !== newSession.location.country) {
    return true
  }
  
  // Check for unusual device
  if (!user.knownDevices.includes(newSession.deviceName)) {
    return true
  }
  
  return false
}

// Send email notification
if (detectSuspiciousLogin(user, session)) {
  await sendSecurityAlert(user.email, session)
}
```

## Data Protection

### Personal Information

**Minimize data collection:**
- Only collect necessary information
- Make optional fields truly optional
- Provide data export functionality
- Allow data deletion (GDPR compliance)

### Data Encryption

**Encrypt sensitive data at rest:**
```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32 bytes
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(text: string): string {
  const parts = text.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encryptedText = Buffer.from(parts[1], 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
```

### File Upload Security

**Avatar validation:**
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function validateAvatar(file: File): ValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }
  
  // Check file size
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large' }
  }
  
  // Check magic bytes (file signature)
  const reader = new FileReader()
  reader.onload = (e) => {
    const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4)
    const header = Array.from(arr).map(b => b.toString(16)).join('')
    
    // JPEG: FF D8 FF
    // PNG: 89 50 4E 47
    // GIF: 47 49 46 38
    const validHeaders = ['ffd8ff', '89504e47', '47494638']
    if (!validHeaders.some(h => header.startsWith(h))) {
      return { valid: false, error: 'Invalid file signature' }
    }
  }
  
  return { valid: true }
}
```

## API Security

### Authentication

**Require valid tokens:**
```typescript
// Middleware
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    const session = await verifyToken(token)
    req.user = await getUserById(session.userId)
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Authorization

**Check permissions:**
```typescript
function canUpdateProfile(requestingUser: UserProfile, targetProfile: UserProfile): boolean {
  // Users can update own profile
  if (requestingUser.id === targetProfile.id) return true
  
  // Admins can update any profile
  if (requestingUser.role === 'admin') return true
  
  return false
}

// In route handler
if (!canUpdateProfile(req.user, targetProfile)) {
  return res.status(403).json({ error: 'Forbidden' })
}
```

### Rate Limiting

**Prevent brute force:**
```typescript
import rateLimit from 'express-rate-limit'

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many password change attempts'
})

app.post('/api/change-password', passwordChangeLimiter, async (req, res) => {
  // Handler
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts'
})
```

### Input Validation

**Sanitize all inputs:**
```typescript
import validator from 'validator'

function sanitizeProfileInput(data: any): ProfileFormData {
  return {
    firstName: validator.escape(data.firstName?.trim() || ''),
    lastName: validator.escape(data.lastName?.trim() || ''),
    email: validator.normalizeEmail(data.email || ''),
    phoneNumber: data.phoneNumber ? validator.escape(data.phoneNumber) : undefined,
    // ...
  }
}
```

## Activity Logging

### What to Log

**Security-relevant events:**
- Login attempts (success and failure)
- Password changes
- Profile updates
- 2FA setup/disable
- Session creation/revocation
- Permission changes
- Data exports

### Log Structure

```typescript
interface SecurityLog {
  id: string
  userId: string
  action: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  location?: GeoLocation
  status: 'success' | 'failure'
  metadata: {
    reason?: string
    affectedResource?: string
    previousValue?: any
    newValue?: any
  }
}
```

### Audit Trail

**Immutable logs:**
- Never delete logs
- Hash log chains to prevent tampering
- Retain for compliance periods (7+ years)
- Regular backups

## Frontend Security

### XSS Prevention

**Escape user content:**
```vue
<!-- ✅ Automatically escaped -->
<div>{{ userInput }}</div>

<!-- ❌ DANGEROUS -->
<div v-html="userInput"></div>

<!-- ✅ Only if sanitized -->
<div v-html="sanitizeHtml(userInput)"></div>
```

### CSRF Protection

**Include CSRF tokens:**
```typescript
// Get token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

// Include in requests
await fetch('/api/update-profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
})
```

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.amlguard.com;
">
```

## Compliance

### GDPR

- Obtain consent for data processing
- Provide data export (JSON/CSV)
- Allow data deletion
- Document data retention policies
- Implement right to be forgotten

### Data Retention

```typescript
const RETENTION_PERIODS = {
  activityLogs: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
  sessions: 90 * 24 * 60 * 60 * 1000,          // 90 days
  deletedProfiles: 30 * 24 * 60 * 60 * 1000    // 30 days
}
```

## Security Checklist

- [ ] All passwords hashed with bcrypt (cost factor ≥ 12)
- [ ] 2FA available for all users, required for admins
- [ ] Session tokens cryptographically secure
- [ ] Automatic session expiration after inactivity
- [ ] All API endpoints authenticated and authorized
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation and sanitization
- [ ] File upload validation (type, size, content)
- [ ] Activity logging for security events
- [ ] HTTPS enforced for all traffic
- [ ] CSRF protection enabled
- [ ] XSS prevention (escape user content)
- [ ] Content Security Policy configured
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Data encryption at rest
- [ ] GDPR compliance

---

**Congratulations!** You've completed the Profile module documentation. For implementation details, refer back to the specific documentation files for each topic.
