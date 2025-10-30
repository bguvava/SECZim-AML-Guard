# AMLGuard Landing Page Module

## Overview
The Landing Page module serves as the public-facing entry point to the AMLGuard system. It provides visitors with a comprehensive overview of the system's capabilities, features, and value proposition.

## Components

### 1. NavigationBar.vue
- **Location**: `/src/components/layout/NavigationBar.vue`
- **Purpose**: Persistent navigation header with responsive mobile menu
- **Features**:
  - Scroll-triggered background change
  - Desktop: Horizontal navigation with links and login button
  - Mobile: Hamburger menu with slide-in drawer
  - Smooth scroll to sections
  - Accessible keyboard navigation

### 2. HeroSection.vue
- **Location**: `/src/components/layout/HeroSection.vue`
- **Purpose**: Eye-catching introduction with value proposition
- **Features**:
  - Animated headline and tagline
  - Animated background gradient elements
  - Two CTA buttons: "Get Started" and "Learn More"
  - Quick stats showcase (100% Automated, 24/7 Monitoring, Real-time Alerts)
  - Mock dashboard preview with feature cards
  - Responsive grid layout

### 3. FeaturesSection.vue
- **Location**: `/src/components/layout/FeaturesSection.vue`
- **Purpose**: Showcase 8 key system features
- **Features**:
  - Grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
  - Color-coded feature cards with icons
  - Hover effects and animations
  - Features:
    1. Automated Risk Assessment
    2. Real-time Alerts
    3. Compliance Tracking
    4. Case Management
    5. Deficiency Tracking
    6. Training Portal
    7. Enterprise Security
    8. Centralized Repository

### 4. SystemOverview.vue
- **Location**: `/src/components/layout/SystemOverview.vue`
- **Purpose**: Visualize end-to-end supervision workflow
- **Features**:
  - 5-step workflow visualization
  - Steps: Onboarding → Risk Assessment → Monitoring → Inspections → Verification
  - Connecting line between steps (desktop)
  - Numbered step badges
  - Key benefits statistics panel
  - Responsive card layout

### 5. FooterSection.vue
- **Location**: `/src/components/layout/FooterSection.vue`
- **Purpose**: Site footer with links, contact info, and credits
- **Features**:
  - 4-column grid: Brand, Quick Links, Resources, Contact
  - SECZim reference panel
  - Contact information with icons
  - Developer credits: "Developed with ❤️ by bguvava"
  - Copyright notice
  - External links (SECZim website, portfolio)

## Design System

### Color Palette
```typescript
Primary: #1976D2 (Trust, authority)
Secondary: #00897B (Growth, compliance)
Success: #43A047
Warning: #FB8C00
Danger: #E53935
Info: #039BE5
High Risk: #D32F2F
Medium Risk: #F57C00
Low Risk: #388E3C
```

### Typography
- Font Family: Inter (Google Fonts)
- Headings: Bold (600-700 weight)
- Body: Regular (400 weight)
- Scale: H1 (4xl-6xl), H2 (3xl-4xl), H3 (lg-xl), Body (base), Small (sm)

### Spacing
- Section Padding: py-16 (mobile) to py-32 (desktop)
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Grid Gap: gap-6 to gap-12
- Card Padding: p-6 to p-12

### Animations
- Fade In: 0.5s ease-in-out
- Slide Up: 0.6s ease-out
- Hover Scale: scale-110 transition-transform
- Scroll Animations: @vueuse/motion visible-once directive

## Responsive Breakpoints
- Mobile: 320px - 767px (1 column layouts)
- Tablet: 768px - 1023px (2 column layouts)
- Desktop: 1024px+ (4 column layouts)

## Accessibility Features
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states (Tailwind focus: utilities)
- Color contrast ratio: 4.5:1 minimum
- Alt text for all visual elements

## Performance Optimizations
- Lazy loading components (route-level code splitting)
- @vueuse/motion visible-once for scroll animations (renders once)
- Optimized SVG icons (Lucide Vue Next)
- Minimal custom CSS (Tailwind utilities)
- Vite build optimization

## User Flow
1. **Page Load**: Loading spinner → Fade in content
2. **Hero Section**: Read value proposition → Click CTA or Learn More
3. **Features Section**: Scroll through features → Understand capabilities
4. **System Overview**: Learn workflow → See benefits
5. **Footer**: Access contact info → Navigate to resources → View credits
6. **CTA**: Click "Get Started" or "Login" → Navigate to authentication

## Testing Checklist
- [ ] Page loads in < 2 seconds
- [ ] All animations trigger smoothly
- [ ] Navigation menu works on all devices
- [ ] Mobile hamburger menu opens/closes correctly
- [ ] Smooth scroll to sections works
- [ ] All links navigate correctly
- [ ] Hover states work on all interactive elements
- [ ] Loading spinner displays and dismisses
- [ ] Footer credits link to portfolio
- [ ] SECZim link opens in new tab
- [ ] Responsive layout at all breakpoints
- [ ] Keyboard navigation works
- [ ] No console errors

## Future Enhancements
- Add video demo/explainer
- Implement contact form
- Add testimonials section
- Include screenshots gallery
- Add FAQ accordion
- Implement dark mode toggle
- Add language switcher (English/Shona)
