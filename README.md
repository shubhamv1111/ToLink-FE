# ToLink Frontend

<p align="center">
  A modern, responsive URL shortener dashboard built with <strong>Next.js 14</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.
</p>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + tailwindcss-animate |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Server State | TanStack React Query v5 |
| Theming | next-themes (dark / light mode) |
| Notifications | Sonner (toast) |

---

## Features

- **URL Shortening** — Create short links with optional custom aliases
- **Password Protection** — Secure individual links with a password
- **Link Expiry** — Set optional expiration dates on links
- **Analytics Dashboard** — Visualize clicks, top countries, devices, browsers, and referrers
- **QR Code Generation** — Generate and download QR codes for any link
- **Google OAuth** — One-click sign-in with Google
- **Email Verification** — Account activation via email link
- **Password Reset** — Forgot-password flow via email
- **Dark / Light Mode** — System-aware theme toggle
- **Responsive Design** — Fully mobile-friendly layout

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── [shortCode]/         # Public short-link redirect page
│   ├── access/[shortCode]/  # Password-protected link access page
│   ├── dashboard/           # Main dashboard (link management)
│   ├── analytics/           # Analytics page
│   ├── qr-code/             # QR code generator page
│   ├── profile/             # User profile settings
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── forgot-password/     # Forgot password page
│   ├── reset-password/      # Reset password page
│   ├── about/               # About page
│   ├── features/            # Features landing page
│   ├── contact/             # Contact page
│   └── layout.tsx           # Root layout with providers
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── CreateLinkModal  # Modal for creating/editing links
│   │   ├── DashboardFilters # Search and filter controls
│   │   ├── DashboardStats   # Stats cards (total links, clicks, etc.)
│   │   └── UrlCard          # Individual link card
│   ├── ui/                  # shadcn/ui base components
│   ├── Navbar.tsx           # Top navigation bar
│   ├── Footer.tsx           # Site footer
│   ├── AnalyticsCard.tsx    # Analytics summary card
│   ├── QRCodeDisplay.tsx    # QR code renderer
│   ├── UserProfile.tsx      # Profile display component
│   └── DarkModeToggle.tsx   # Theme toggle button
├── contexts/                # React contexts (Auth, Theme)
├── hooks/                   # Custom React hooks
├── lib/                     # API client, utility functions
├── styles/                  # Global CSS
└── types/                   # TypeScript type definitions
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- The [ToLink Backend](../tolink-backend/README.md) running on port `8080`

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional: override the base URL used for generating short links
# Defaults to the current domain if not set
NEXT_PUBLIC_BASE_URL=http://localhost:4000
```

### 3. Run the development server

```bash
npm run dev
```

The app runs at `http://localhost:4000` by default.

---

## Available Scripts

```bash
npm run dev      # Start development server on port 4000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing / home page |
| `/login` | Login page |
| `/signup` | Registration page |
| `/forgot-password` | Request password reset email |
| `/reset-password` | Set new password via reset token |
| `/dashboard` | Manage all your shortened links |
| `/analytics` | View click analytics and charts |
| `/qr-code` | Generate QR codes for links |
| `/profile` | Manage account settings |
| `/[shortCode]` | Public redirect (handled by backend) |
| `/access/[shortCode]` | Password entry for protected links |
| `/about` | About ToLink |
| `/features` | Feature highlights |
| `/contact` | Contact page |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | — | Backend API base URL |
| `NEXT_PUBLIC_BASE_URL` | No | Current domain | Base URL used in generated short links |

---

## License

This project is **UNLICENSED** — private use only.
