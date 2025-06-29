# ToLink - URL Shortener Frontend

A modern, responsive URL shortener built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dynamic Base URL**: Automatically detects and uses the current domain for generating short URLs
- **URL Shortening**: Create short, memorable links from long URLs
- **Custom Aliases**: Add custom short codes for your links
- **Password Protection**: Secure your links with passwords
- **Analytics Dashboard**: Track clicks, geographic data, and referrer information
- **QR Code Generation**: Generate QR codes for easy sharing
- **Dark Mode**: Beautiful dark and light theme support
- **Responsive Design**: Works perfectly on all devices

## Dynamic Base URL

The application now automatically detects the current domain and uses it as the base URL for generating short links. This means:

- **Development**: Links will use `http://localhost:3000/` (or your dev port)
- **Production**: Links will use your actual domain (e.g., `https://yoursite.com/`)
- **Custom Domain**: You can override this by setting the `NEXT_PUBLIC_BASE_URL` environment variable

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Optional: Override the automatic base URL detection
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tolink-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: Custom context-based auth

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
