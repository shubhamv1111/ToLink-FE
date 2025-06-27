# ToLink Frontend TODO - Next.js (Port 3000)

## ✅ Phase 1: MVP - Basic URL Shortener (2-3 weeks)

_Based on ToLink.md Phase 1 requirements_

### 1.1 Project Setup (✅ DONE)

- [x] Initialize Next.js 14 project with TypeScript
- [x] Setup environment variables (.env.local)
- [x] Basic project structure with src/ directory

### 1.2 Basic Dependencies (Install as needed)

- [ ] Install core UI dependencies:
  ```bash
  npm install lucide-react
  npm install clsx tailwind-merge
  ```
- [ ] Install form handling:
  ```bash
  npm install react-hook-form
  ```
- [ ] Install HTTP client:
  ```bash
  npm install axios
  ```
- [ ] Install notifications:
  ```bash
  npm install react-hot-toast
  ```

### 1.3 Basic UI Components

- [ ] **Button Component** (`src/components/ui/Button.tsx`):
  - [ ] Primary, secondary, outline variants
  - [ ] Loading states with spinner
  - [ ] Size variations (sm, md, lg)
- [ ] **Input Component** (`src/components/ui/Input.tsx`):
  - [ ] Text input with validation states
  - [ ] Error and helper text support
  - [ ] URL input specific styling
- [ ] **Card Component** (`src/components/ui/Card.tsx`):
  - [ ] Basic card with padding and borders
  - [ ] Hover effects
- [ ] **Loading Spinner** (`src/components/ui/LoadingSpinner.tsx`)
- [ ] **Toast Notifications** setup with react-hot-toast

### 1.4 Layout Components

- [ ] **Navbar Component** (`src/components/layout/Navbar.tsx`):
  - [ ] Logo placeholder
  - [ ] Simple navigation links
  - [ ] Responsive design
- [ ] **Footer Component** (`src/components/layout/Footer.tsx`):
  - [ ] Basic footer with links
  - [ ] Copyright information
- [ ] **Layout Component** (`src/components/layout/Layout.tsx`):
  - [ ] Navbar + Content + Footer structure

### 1.5 Home Page - Core Features

- [ ] **Hero Section** (`src/components/home/HeroSection.tsx`):
  - [ ] Main headline and description
  - [ ] Call-to-action
  - [ ] Clean, modern design
- [ ] **URL Shortening Form** (`src/components/home/ShortenForm.tsx`):
  - [ ] Single URL input field
  - [ ] Custom alias input (optional)
  - [ ] Submit button with loading state
  - [ ] Form validation
  - [ ] API integration for POST /api/shorten
- [ ] **Result Display** (`src/components/home/ResultDisplay.tsx`):
  - [ ] Shortened URL display
  - [ ] Copy to clipboard button
  - [ ] QR code preview
  - [ ] Basic click count display

### 1.6 Basic Analytics View

- [ ] **Analytics Card** (`src/components/analytics/AnalyticsCard.tsx`):
  - [ ] Click count display
  - [ ] Creation date
  - [ ] Simple stats card
  - [ ] API integration for GET /api/stats/:shortCode

### 1.7 Features Section

- [ ] **Features Grid** (`src/components/home/FeaturesSection.tsx`):
  - [ ] Feature cards with icons
  - [ ] "How it works" section
  - [ ] Benefits highlighting

### 1.8 Additional Pages

- [ ] **About Page** (`src/app/about/page.tsx`):
  - [ ] Project information
  - [ ] Simple about content
- [ ] **Contact Page** (`src/app/contact/page.tsx`):
  - [ ] Basic contact information
- [ ] **404 Page** (`src/app/not-found.tsx`):
  - [ ] Custom not found page

### 1.9 API Integration

- [ ] **API Service** (`src/services/api.ts`):
  - [ ] Axios instance with base URL
  - [ ] URL shortening API call
  - [ ] Basic analytics API call
  - [ ] Error handling

### 1.10 Responsive Design

- [ ] Mobile-first approach
- [ ] Responsive navigation
- [ ] Mobile-optimized forms
- [ ] Touch-friendly buttons

---

## 🔄 Phase 2: Enhanced Features (1-2 weeks)

_Will be implemented after Phase 1 MVP_

### 2.1 Authentication System

- [ ] Install NextAuth.js:
  ```bash
  npm install next-auth
  ```
- [ ] **Login/Register Pages**:
  - [ ] Login form with email/password
  - [ ] Registration form
  - [ ] Google OAuth integration
- [ ] **Protected Routes**:
  - [ ] Route protection middleware
  - [ ] User session management

### 2.2 Personal Dashboard

- [ ] Install data fetching library:
  ```bash
  npm install @tanstack/react-query
  ```
- [ ] **Dashboard Layout**:
  - [ ] Sidebar navigation
  - [ ] Dashboard overview
- [ ] **My URLs Page**:
  - [ ] User's URL list
  - [ ] Search and filter
  - [ ] Edit/delete actions
  - [ ] Pagination

### 2.3 Analytics Dashboard

- [ ] Install charting library:
  ```bash
  npm install recharts
  ```
- [ ] **Analytics Components**:
  - [ ] Click graphs over time
  - [ ] Geographic data visualization
  - [ ] Device analytics
  - [ ] Referrer tracking

### 2.4 Advanced URL Features

- [ ] **Link Management**:
  - [ ] Set expiry dates
  - [ ] Password protection
  - [ ] Categories/tags
- [ ] **Bulk Operations**:
  - [ ] CSV file upload
  - [ ] Bulk URL creation

### 2.5 Enhanced UX

- [ ] Install animation library:
  ```bash
  npm install framer-motion
  ```
- [ ] **Dark Mode**:
  - [ ] Theme toggle
  - [ ] Dark/light mode persistence
- [ ] **Loading States**:
  - [ ] Skeleton loaders
  - [ ] Better loading indicators
- [ ] **Animations**:
  - [ ] Page transitions
  - [ ] Micro-interactions

---

## 🔮 Phase 3: Advanced Features (Future)

_Advanced features for later implementation_

### 3.1 Advanced Analytics

- [ ] Real-time analytics
- [ ] Advanced chart types
- [ ] Export functionality
- [ ] Custom date ranges

### 3.2 Admin Panel

- [ ] Admin dashboard
- [ ] User management
- [ ] System monitoring
- [ ] Content moderation

### 3.3 Performance Optimization

- [ ] Code splitting
- [ ] Image optimization
- [ ] Caching strategies
- [ ] SEO optimization

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   ├── contact/page.tsx         # Contact page
│   ├── layout.tsx               # Root layout
│   └── not-found.tsx            # 404 page
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ShortenForm.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── FeaturesSection.tsx
│   └── analytics/
│       └── AnalyticsCard.tsx
├── services/
│   └── api.ts                   # API service
├── lib/
│   └── utils.ts                 # Utility functions
└── types/
    └── index.ts                 # Type definitions
```

## 🎯 Phase 1 Success Criteria

- [x] Project initialized with Next.js 14
- [ ] Basic URL shortening functionality working
- [ ] Clean, responsive design
- [ ] Copy to clipboard feature
- [ ] Basic analytics display
- [ ] QR code generation
- [ ] Mobile-friendly interface

## 📝 Notes

- Focus on core functionality first
- Keep design simple and clean
- Ensure mobile responsiveness
- Test thoroughly before moving to Phase 2
- Follow the exact API endpoints from backend
