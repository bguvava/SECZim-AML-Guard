# AMLGuard Landing Page - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd c:\xampp\htdocs\SECZim-AML-Guard
pnpm install
# OR if pnpm has issues
npm install
```

### Step 2: Start Development Server
```bash
pnpm dev
```

### Step 3: Open in Browser
Navigate to: **http://localhost:3000**

---

## ✅ What You Should See

1. **Navigation Bar** (Top)
   - AMLGuard logo with shield icon
   - Menu: Home, Features, How It Works, Contact
   - Blue "Login" button

2. **Hero Section**
   - Large headline: "Intelligent AML/CFT Supervision"
   - Tagline about SECZim
   - Two buttons: "Get Started" and "Learn More"
   - Mock dashboard on the right
   - Three stat cards at bottom

3. **Features Section**
   - 8 feature cards in grid
   - Icons with descriptions
   - "Get Started Today" button

4. **System Overview**
   - 5 workflow steps (01-05)
   - Benefits statistics panel

5. **Footer**
   - Links and contact info
   - SECZim reference
   - **"Developed with ❤️ by bguvava"** credit

---

## 🧪 Manual Testing Checklist

### Desktop (1024px+)
- [ ] All sections visible and properly aligned
- [ ] Navigation menu horizontal
- [ ] Feature cards in 4 columns
- [ ] Workflow steps in 5 columns
- [ ] Footer in 4 columns

### Tablet (768px - 1023px)
- [ ] Feature cards in 2 columns
- [ ] Workflow steps wrap nicely
- [ ] Footer adjusts to 2 columns

### Mobile (320px - 767px)
- [ ] Hamburger menu appears
- [ ] Hamburger menu opens/closes
- [ ] All text readable
- [ ] Feature cards stack vertically
- [ ] No horizontal scroll

### Interactions
- [ ] Click "Get Started" button
- [ ] Click "Learn More" button (should smooth scroll)
- [ ] Click navigation links (smooth scroll to sections)
- [ ] Hover over feature cards (should scale)
- [ ] Click mobile hamburger (should slide in)
- [ ] Click footer links
- [ ] Click "bguvava" link (should open portfolio)
- [ ] Click "Visit SECZim" button

### Animations
- [ ] Hero section fades in on load
- [ ] Feature cards animate in on scroll
- [ ] Workflow steps animate in on scroll
- [ ] Background gradient orbs animate
- [ ] Loading spinner shows on initial load

---

## 🐛 Common Issues & Solutions

### Issue: Port 3000 Already in Use
**Solution**:
```bash
pnpm dev --port 3001
```

### Issue: Module Not Found Errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Animations Not Working
**Check**:
1. Is `@vueuse/motion` installed?
2. Check browser console for errors
3. Try different browser

### Issue: Styles Not Applied
**Solution**:
```bash
# Rebuild Tailwind
pnpm dev
# Hard refresh browser: Ctrl+Shift+R
```

### Issue: TypeScript Errors
**Solution**:
```bash
# Check types
pnpm vue-tsc --noEmit

# If errors, review component props and types
```

---

## 📱 Testing on Real Devices

### Mobile Testing
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start dev server: `pnpm dev --host`
3. On mobile, navigate to: `http://YOUR_IP:3000`

### Browser Testing
Test in:
- [x] Chrome/Edge (Chromium)
- [x] Firefox
- [x] Safari (if on Mac)

---

## 🎨 Customization Quick Reference

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#1976D2', // Change this
  }
}
```

### Change Typography
Edit `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'] // Change font
}
```

### Change Content
Edit component files in `/src/components/layout/`:
- `HeroSection.vue` - Hero text and CTA
- `FeaturesSection.vue` - Feature cards
- `SystemOverview.vue` - Workflow steps
- `FooterSection.vue` - Footer links and credits

### Change Animations
Edit animation timings in components:
```vue
:enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
```

---

## 📊 Performance Checklist

Run Lighthouse audit:
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Click "Generate report"
4. Check scores:
   - Performance: Target 90+
   - Accessibility: Target 95+
   - Best Practices: Target 95+
   - SEO: Target 90+

---

## 🔄 Next Steps After Landing Page

1. **Authentication Module**
   - Login page
   - Password reset flow
   - Session management

2. **Dashboard Layout**
   - Sidebar navigation
   - Top bar with user menu
   - Main content area

3. **User Roles**
   - Administrator dashboard
   - Supervisor dashboard
   - Entity dashboard

---

## 📞 Support

**Developer**: bguvava
**Portfolio**: https://bguvava.github.io/portfolio/
**Project**: AMLGuard for SECZim

---

## 🎉 Success Indicators

✅ Landing page loads in < 2 seconds
✅ All animations smooth (60fps)
✅ Mobile menu works flawlessly
✅ All links navigate correctly
✅ Developer credit visible in footer
✅ No console errors
✅ Responsive on all devices

---

**Ready to build? Run `pnpm dev` and let's go! 🚀**
