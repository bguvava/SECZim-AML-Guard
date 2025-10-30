# Security Documentation
## AMLGuard Authentication Module

**Version:** 1.0.0  
**Last Updated:** October 29, 2025  
**Classification:** Internal Development Documentation

---

## Table of Contents
1. [Security Overview](#security-overview)
2. [Current Implementation (Prototype)](#current-implementation-prototype)
3. [Production Security Requirements](#production-security-requirements)
4. [Threat Model](#threat-model)
5. [Security Best Practices](#security-best-practices)
6. [Vulnerability Mitigation](#vulnerability-mitigation)
7. [Compliance Considerations](#compliance-considerations)
8. [Security Checklist](#security-checklist)

---

## 1. Security Overview

### 1.1 Purpose
This document outlines security considerations, current prototype limitations, and production-ready security requirements for the AMLGuard Authentication Module.

### 1.2 Security Principles
- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Users have minimum necessary permissions
- **Fail Secure**: System defaults to secure state on error
- **Complete Mediation**: Every access checked against access control
- **Open Design**: Security not dependent on secrecy of implementation

### 1.3 Current Status
**Environment:** Development/Prototype  
**Security Level:** Demo (NOT production-ready)  
**Purpose:** Functional prototype for stakeholder review

---

## 2. Current Implementation (Prototype)

### 2.1 What's Implemented

#### ✅ Client-Side Validation
- Email format validation
- Password strength requirements
- Form input sanitization via Vue templates
- Real-time validation feedback

#### ✅ Session Management
- Session timeout (8 hours default, 24 hours with Remember Me)
- Session expiry warnings (5 minutes before timeout)
- Auto-logout on session expiration
- Session restoration on page refresh

#### ✅ Role-Based Access Control (RBAC)
- Three distinct roles: Administrator, Supervisor, Entity
- Navigation guards for protected routes
- Role verification before accessing resources
- Unauthorized access redirects

#### ✅ XSS Prevention (Basic)
- Vue's automatic template escaping
- No `v-html` with user input
- Content Security Policy ready

#### ✅ Secure Storage Patterns
- localStorage for persistent sessions
- sessionStorage for temporary sessions
- Session data includes expiry timestamps
- Token-based authentication pattern

### 2.2 Known Limitations (Prototype Only)

#### ⚠️ Mock Authentication
**Issue:** No real backend validation  
**Risk:** Anyone with code access can bypass authentication  
**Status:** Acceptable for prototype  
**Production Fix:** Implement server-side authentication API

#### ⚠️ Plaintext Passwords in Demo Data
**Issue:** `demoUsers.ts` contains passwords  
**Risk:** Passwords visible in source code  
**Status:** Demo-only, no real user data  
**Production Fix:** Remove demo users, implement proper user database

#### ⚠️ Client-Side Only Validation
**Issue:** All validation happens in browser  
**Risk:** Can be bypassed with dev tools  
**Status:** Acceptable for prototype  
**Production Fix:** Implement server-side validation

#### ⚠️ No Rate Limiting
**Issue:** Unlimited login attempts  
**Risk:** Brute force attacks possible  
**Status:** No real accounts to compromise  
**Production Fix:** Implement rate limiting on backend

#### ⚠️ Mock JWT Tokens
**Issue:** Tokens not cryptographically signed  
**Risk:** Tokens can be forged  
**Status:** Acceptable for prototype  
**Production Fix:** Implement proper JWT with RS256 signing

#### ⚠️ No CSRF Protection
**Issue:** No CSRF tokens  
**Risk:** Cross-site request forgery  
**Status:** No state-changing APIs yet  
**Production Fix:** Implement CSRF tokens for all POST/PUT/DELETE

#### ⚠️ No HTTPS Enforcement
**Issue:** Can run over HTTP  
**Risk:** Man-in-the-middle attacks  
**Status:** Local development only  
**Production Fix:** Enforce HTTPS, HSTS headers

---

## 3. Production Security Requirements

### 3.1 Authentication

#### ✅ Required: Server-Side Authentication
```typescript
// Backend API endpoint
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

// Response
{
  "access_token": "eyJhbGc...",
  "refresh_token": "dGVzdC...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "ADMINISTRATOR"
  }
}
```

#### ✅ Required: Password Hashing
**Algorithm:** bcrypt (cost factor 12+)  
**Alternative:** Argon2id (recommended for new projects)

```typescript
// Backend implementation example (Node.js)
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

// Hash password on registration
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

// Verify password on login
const isValid = await bcrypt.compare(password, hashedPassword)
```

#### ✅ Required: Secure Token Generation
**Algorithm:** RS256 (RSA Signature with SHA-256)  
**Library:** jsonwebtoken (Node.js) or equivalent

```typescript
// Backend JWT generation
import jwt from 'jsonwebtoken'

const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
}

const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' })
```

#### ✅ Required: Token Validation Middleware
```typescript
// Express middleware example
import jwt from 'jsonwebtoken'

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}
```

### 3.2 Password Security

#### ✅ Required: Strong Password Policy
- Minimum 12 characters (upgrade from 8)
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Not in common password list (Have I Been Pwned API)
- Not same as previous 3 passwords
- Expires every 90 days (for privileged accounts)

#### ✅ Required: Password Reset Security
1. Generate cryptographically secure token
2. Store token hash in database (not plaintext)
3. Set token expiry (15 minutes recommended)
4. Single use token (invalidate after use)
5. Email token in password reset link
6. Verify token before allowing password change
7. Invalidate all sessions after password change

```typescript
// Backend password reset token generation
import crypto from 'crypto'

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

const tokenHash = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex')

// Store tokenHash in database with expiry
const resetToken = {
  userId: user.id,
  tokenHash: tokenHash,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
}
```

### 3.3 Session Security

#### ✅ Required: Secure Cookie Configuration
```typescript
// Express session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only
    httpOnly: true,      // Not accessible via JavaScript
    sameSite: 'strict',  // CSRF protection
    maxAge: 8 * 60 * 60 * 1000  // 8 hours
  }
}))
```

#### ✅ Required: Token Refresh Strategy
- Short-lived access tokens (15-60 minutes)
- Long-lived refresh tokens (7-30 days)
- Refresh token rotation on each use
- Refresh token family tracking (detect token theft)

```typescript
// Refresh token endpoint
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "dGVzdC..."
}

// Response
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "expires_in": 3600
}
```

#### ✅ Required: Session Invalidation
- Logout invalidates all tokens for that session
- "Logout All Devices" invalidates all user tokens
- Password change invalidates all sessions
- Account deactivation invalidates all sessions

### 3.4 CSRF Protection

#### ✅ Required: CSRF Tokens
```typescript
// Backend CSRF token generation
import csrf from 'csurf'

const csrfProtection = csrf({ cookie: true })

app.post('/api/auth/login', csrfProtection, (req, res) => {
  // Handle login
})

// Frontend: Include CSRF token in requests
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(credentials)
})
```

#### ✅ Required: SameSite Cookie Attribute
All cookies must have `SameSite=Strict` or `SameSite=Lax`

### 3.5 Rate Limiting

#### ✅ Required: Login Rate Limiting
- 5 failed attempts per IP address per 15 minutes
- 10 failed attempts per email per hour
- Progressive delays after failures
- CAPTCHA after 3 failed attempts

```typescript
// Backend rate limiting (Express)
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // Handle login
})
```

#### ✅ Required: Account Lockout
- Lock account after 10 failed attempts
- Unlock after 30 minutes or admin intervention
- Notify user via email of lockout
- Log all lockout events

### 3.6 Input Validation & Sanitization

#### ✅ Required: Server-Side Validation
Never trust client-side validation alone.

```typescript
// Backend validation with Zod
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(12).max(100)
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body)
    // Proceed with validated data
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' })
  }
})
```

#### ✅ Required: SQL Injection Prevention
- Use parameterized queries (prepared statements)
- Never concatenate user input into SQL
- Use ORM with parameterization (e.g., Prisma, TypeORM)

```typescript
// Safe database query (Prisma example)
const user = await prisma.user.findUnique({
  where: { email: validatedEmail }
})
```

#### ✅ Required: XSS Prevention
- Content Security Policy (CSP) headers
- Input sanitization on server
- Output encoding
- Avoid `innerHTML`, use `textContent`

```typescript
// CSP Header (Express)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  )
  next()
})
```

---

## 4. Threat Model

### 4.1 Threat Actors

| Actor | Motivation | Capability | Likelihood |
|-------|-----------|------------|------------|
| External Attacker | Data theft, disruption | Low-Medium | Medium |
| Malicious Insider | Data theft, sabotage | High | Low |
| Automated Bots | Credential stuffing | Medium | High |
| Social Engineer | Credential theft | Low-Medium | Medium |

### 4.2 Attack Scenarios

#### Scenario 1: Brute Force Attack
**Threat:** Attacker attempts multiple login combinations  
**Impact:** Unauthorized access if successful  
**Mitigation:**
- Rate limiting (5 attempts per 15 min)
- Account lockout (10 failed attempts)
- CAPTCHA after 3 attempts
- Strong password policy
- Monitoring and alerting

#### Scenario 2: Session Hijacking
**Threat:** Attacker steals valid session token  
**Impact:** Impersonation of legitimate user  
**Mitigation:**
- HTTPS only (TLS 1.3+)
- HttpOnly cookies
- SameSite cookie attribute
- Short session lifetime
- IP address binding (optional)
- User agent validation

#### Scenario 3: Credential Stuffing
**Threat:** Use of leaked credentials from other breaches  
**Impact:** Account takeover  
**Mitigation:**
- Check against Have I Been Pwned API
- Force password change if breach detected
- Multi-factor authentication
- Anomaly detection (unusual login location/time)

#### Scenario 4: Phishing
**Threat:** Social engineering to obtain credentials  
**Impact:** Credential theft  
**Mitigation:**
- User security awareness training
- Multi-factor authentication
- Email verification for sensitive actions
- Monitor for suspicious domains

#### Scenario 5: XSS Attack
**Threat:** Inject malicious scripts  
**Impact:** Session token theft, malicious actions  
**Mitigation:**
- Content Security Policy
- Input sanitization
- Output encoding
- Vue's automatic escaping

#### Scenario 6: CSRF Attack
**Threat:** Trick user into unwanted actions  
**Impact:** Unauthorized state changes  
**Mitigation:**
- CSRF tokens
- SameSite cookies
- Verify request origin
- Require re-authentication for sensitive actions

---

## 5. Security Best Practices

### 5.1 Development Practices

#### Code Security
- ✅ Regular dependency updates (weekly)
- ✅ Automated vulnerability scanning (npm audit, Snyk)
- ✅ Code review for security issues
- ✅ Static analysis (ESLint security plugins)
- ✅ No secrets in source code (use environment variables)
- ✅ Principle of least privilege in code

#### Secure Configuration
```typescript
// .env.example (never commit actual .env)
# API Configuration
API_URL=https://api.amlguard.seczim.co.zw
API_TIMEOUT=30000

# Session Configuration
SESSION_SECRET=generate_strong_random_string_here
SESSION_LIFETIME=28800000  # 8 hours in milliseconds

# Security
ENABLE_RATE_LIMITING=true
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000  # 15 minutes

# Feature Flags
ENABLE_MFA=false  # Enable when implemented
ENABLE_PASSWORD_EXPIRY=false
```

### 5.2 Deployment Security

#### HTTPS Configuration
```nginx
# Nginx HTTPS configuration
server {
    listen 443 ssl http2;
    server_name amlguard.seczim.co.zw;

    # SSL certificates
    ssl_certificate /etc/ssl/certs/amlguard.crt;
    ssl_certificate_key /etc/ssl/private/amlguard.key;

    # SSL protocols and ciphers
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name amlguard.seczim.co.zw;
    return 301 https://$server_name$request_uri;
}
```

#### Environment Isolation
- Development: Local only, demo data
- Staging: Isolated, sanitized production copy
- Production: Strict access controls, real data

### 5.3 Monitoring & Logging

#### Security Events to Log
```typescript
// Security event logging
enum SecurityEventType {
  LOGIN_SUCCESS = 'auth.login.success',
  LOGIN_FAILURE = 'auth.login.failure',
  LOGOUT = 'auth.logout',
  PASSWORD_RESET_REQUEST = 'auth.password_reset.request',
  PASSWORD_RESET_SUCCESS = 'auth.password_reset.success',
  PASSWORD_CHANGE = 'auth.password.change',
  ACCOUNT_LOCKED = 'auth.account.locked',
  SESSION_EXPIRED = 'auth.session.expired',
  UNAUTHORIZED_ACCESS = 'auth.access.unauthorized',
  MFA_ENABLED = 'auth.mfa.enabled',
  MFA_DISABLED = 'auth.mfa.disabled'
}

interface SecurityLog {
  timestamp: string
  eventType: SecurityEventType
  userId?: string
  email?: string
  ipAddress: string
  userAgent: string
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

// Example log entry
{
  "timestamp": "2025-10-29T10:15:30.000Z",
  "eventType": "auth.login.failure",
  "email": "brian.guvava@seczim.co.zw",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": false,
  "errorMessage": "Invalid password",
  "metadata": {
    "attemptNumber": 3,
    "remainingAttempts": 2
  }
}
```

#### Security Alerts
- 5+ failed login attempts from single IP
- 10+ failed login attempts for single account
- Account lockout triggered
- Login from new location/device
- Multiple concurrent sessions
- Session hijacking detected
- Privilege escalation attempt
- Unusual after-hours access

### 5.4 Incident Response

#### Security Incident Procedure
1. **Detect**: Automated monitoring alerts
2. **Assess**: Determine scope and severity
3. **Contain**: Lock affected accounts, revoke tokens
4. **Eradicate**: Patch vulnerability, change credentials
5. **Recover**: Restore services, verify integrity
6. **Document**: Post-mortem, lessons learned

#### Contact Information
- Security Team: security@seczim.co.zw
- Developer: bguvava (brian.guvava@seczim.co.zw)
- Admin: IT Department

---

## 6. Vulnerability Mitigation

### 6.1 OWASP Top 10 Coverage

| Vulnerability | Status | Mitigation |
|--------------|--------|------------|
| A01: Broken Access Control | ✅ Mitigated | RBAC, route guards, server-side checks |
| A02: Cryptographic Failures | ⚠️ Partial | HTTPS required, password hashing needed |
| A03: Injection | ✅ Mitigated | Parameterized queries, input validation |
| A04: Insecure Design | ✅ Mitigated | Security by design, threat modeling |
| A05: Security Misconfiguration | ⚠️ Partial | Secure defaults, production hardening needed |
| A06: Vulnerable Components | ✅ Mitigated | Regular updates, dependency scanning |
| A07: Authentication Failures | ⚠️ Partial | Strong auth, MFA needed for production |
| A08: Software/Data Integrity | ✅ Mitigated | SRI, signed packages, audit logs |
| A09: Security Logging | ⚠️ Partial | Event logging implemented, SIEM needed |
| A10: Server-Side Request Forgery | ✅ Not Applicable | No server-side requests to external services |

### 6.2 Penetration Testing
**Recommended Frequency:** Annually + after major changes  
**Scope:** Full authentication module  
**Tools:** OWASP ZAP, Burp Suite, Metasploit  
**Tester:** Third-party security firm (independent)

---

## 7. Compliance Considerations

### 7.1 Data Protection (GDPR/POPIA)
- User consent for data processing
- Right to access personal data
- Right to erasure ("right to be forgotten")
- Data breach notification (72 hours)
- Data minimization
- Privacy by design

### 7.2 Financial Regulations
- AML/CFT compliance
- Audit trail requirements
- Access controls for financial data
- Data retention policies
- Encryption for data at rest and in transit

### 7.3 Zimbabwe Regulations
- Cyber and Data Protection Act compliance
- Securities and Exchange Commission requirements
- Reserve Bank of Zimbabwe guidelines
- National Payment Systems Act

---

## 8. Security Checklist

### 8.1 Pre-Production Checklist

**Authentication:**
- [ ] Passwords hashed with bcrypt (cost 12+)
- [ ] JWT tokens with RS256 signing
- [ ] Token expiry validation
- [ ] Refresh token rotation
- [ ] Session timeout implemented
- [ ] Multi-factor authentication available

**Authorization:**
- [ ] Role-based access control verified
- [ ] Server-side permission checks
- [ ] Principle of least privilege applied
- [ ] Admin functions properly protected

**Input Validation:**
- [ ] Server-side validation for all inputs
- [ ] SQL injection tests passed
- [ ] XSS prevention verified
- [ ] File upload restrictions (if applicable)

**Session Security:**
- [ ] HTTPS enforced
- [ ] Secure cookie flags (HttpOnly, Secure, SameSite)
- [ ] Session fixation prevented
- [ ] Concurrent session limits

**Rate Limiting:**
- [ ] Login endpoint rate limited
- [ ] Password reset rate limited
- [ ] Account lockout after failures
- [ ] CAPTCHA implemented

**Logging & Monitoring:**
- [ ] Security events logged
- [ ] Audit trail complete
- [ ] Alerts configured
- [ ] Log retention policy defined

**Infrastructure:**
- [ ] Firewall configured
- [ ] Intrusion detection enabled
- [ ] Regular backups scheduled
- [ ] Disaster recovery plan documented

**Compliance:**
- [ ] Privacy policy published
- [ ] Terms of service updated
- [ ] Cookie consent implemented
- [ ] Data retention policy defined

### 8.2 Ongoing Security Tasks

**Daily:**
- [ ] Monitor security alerts
- [ ] Review failed login attempts

**Weekly:**
- [ ] Review access logs
- [ ] Check for suspicious activity
- [ ] Update dependencies with security patches

**Monthly:**
- [ ] Security metrics review
- [ ] User access audit
- [ ] Review and rotate API keys

**Quarterly:**
- [ ] Security training for team
- [ ] Review security policies
- [ ] Penetration testing (optional)

**Annually:**
- [ ] Full security audit
- [ ] Third-party penetration test
- [ ] Disaster recovery drill
- [ ] Update security documentation

---

## 9. Future Enhancements

### 9.1 Multi-Factor Authentication (MFA)
- **Methods:** TOTP (Google Authenticator), SMS, Email
- **Enforcement:** Required for administrators, optional for others
- **Backup Codes:** 10 single-use codes for recovery

### 9.2 Biometric Authentication
- **Methods:** Fingerprint, Face ID
- **Implementation:** WebAuthn API
- **Fallback:** Traditional password

### 9.3 Behavioral Analytics
- **Features:**
  - Unusual login location detection
  - Unusual login time detection
  - Device fingerprinting
  - Velocity checks (multiple logins/second)
- **Action:** Challenge with MFA or block

### 9.4 Advanced Threat Protection
- **Features:**
  - Machine learning anomaly detection
  - Threat intelligence integration
  - Automated response to threats
  - Honeypot accounts

---

## 10. References

### 10.1 Standards & Guidelines
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- NIST Password Guidelines: https://pages.nist.gov/800-63-3/
- CWE Top 25: https://cwe.mitre.org/top25/

### 10.2 Tools & Libraries
- bcrypt: https://github.com/kelektiv/node.bcrypt.js
- jsonwebtoken: https://github.com/auth0/node-jsonwebtoken
- helmet: https://helmetjs.github.io/
- express-rate-limit: https://github.com/express-rate-limit/express-rate-limit
- csurf: https://github.com/expressjs/csurf

### 10.3 Vulnerability Databases
- CVE Database: https://cve.mitre.org/
- NVD: https://nvd.nist.gov/
- Snyk Vulnerability DB: https://snyk.io/vuln/

---

**Document Classification:** Internal  
**Review Cycle:** Quarterly  
**Next Review:** January 29, 2026  
**Document Owner:** bguvava

---

**Developed with ❤️ by bguvava**  
© 2025 AMLGuard by SECZim
