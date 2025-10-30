# AMLGuard

**AMLGuard - Integrated AML/CFT Risk-Based Supervision System**

A comprehensive, secure, and intuitive web-based Risk-Based Supervision (RBS) system for the Securities and Exchange Commission of Zimbabwe (SECZim) to monitor, assess, and enforce Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT) compliance across all Securities Market Intermediaries (SMIs).

## 🚀 Features

- **Automated Risk Assessment**: Intelligent calculation engine for ML/TF/PF risk scoring
- **Real-time Alerts**: Instant notifications for STR/CTR filings and UN sanctions updates
- **Compliance Tracking**: Systematic evaluation of KYC/CDD standards
- **Case Management**: Centralized platform for MLA requests and complaints
- **Deficiency Tracking**: Monitor remediation of identified deficiencies
- **Training Portal**: Manage training materials and track participation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API) + TypeScript
- **Build Tool**: Vite 5+
- **Package Manager**: pnpm
- **UI Components**: shadcn-vue (Radix Vue)
- **Styling**: Tailwind CSS 3+
- **Icons**: lucide-vue-next
- **Animations**: @vueuse/motion
- **State Management**: Pinia
- **Routing**: Vue Router 4+
- **Forms**: VeeValidate + Zod
- **HTTP Client**: Axios
- **Notifications**: vue-toastification
- **Testing**: Vitest, Playwright

## 📦 Installation

### Prerequisites
- Node.js 20+ LTS
- pnpm 8+ (recommended)

### Setup

```bash
# Clone repository
git clone https://github.com/bguvava/SECZim-AML-Guard.git
cd SECZim-AML-Guard

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🌐 Development

### Project Structure
```
src/
├── components/
│   ├── common/          # Shared components
│   ├── layout/          # Layout components
│   ├── forms/           # Form components
│   └── charts/          # Data visualization
├── views/               # Page components
│   ├── admin/          # Administrator views
│   ├── supervisor/     # Supervisor views
│   ├── entity/         # Entity views
│   └── auth/           # Authentication views
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
├── composables/        # Vue composables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── data/               # Mock data
├── styles/             # Global styles
└── assets/             # Static assets
```

### Available Scripts

- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit tests
- `pnpm test:ui` - Run tests with UI
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier

## 🎨 Design System

### Colors
- Primary: #1976D2 (Blue)
- Secondary: #00897B (Teal)
- Success: #43A047
- Warning: #FB8C00
- Danger: #E53935
- Info: #039BE5

### Typography
- Font: Inter (Google Fonts)
- Sizes: 12px - 60px (responsive)

## 📚 Documentation

Full documentation available in `/docs` folder:
- Module Documentation: `/docs/landing-page/`
- API Documentation: `/docs/api/`
- Testing Guide: `/docs/testing/`

## 🧪 Testing

### Run Tests
```bash
# Unit tests
pnpm test

# With UI
pnpm test:ui

# E2E tests
pnpm test:e2e
```

### Test Coverage Target
- Overall: 80%+
- Pass Rate: 100% (mandatory)

## 🤝 Contributing

This is a proprietary project for SECZim. Internal contribution guidelines apply.

## 📄 License

Proprietary - © 2025 AMLGuard. All rights reserved.

## 👨‍💻 Developer

**Developed with ❤️ by [bguvava](https://bguvava.github.io/portfolio/) and NUST Team.**

## 📧 Contact

- Email: aml@seczim.co.zw
- Phone: +263 4 781 444-9
- Website: [seczim.co.zw](https://seczim.co.zw/)

## 🏢 Client

**Securities and Exchange Commission of Zimbabwe (SECZim)**
- AML Unit
- Harare, Zimbabwe

---

