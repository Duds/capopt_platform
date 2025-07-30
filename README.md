# CapOpt Platform

A comprehensive operational capability optimisation system designed for high-risk industries (mining, minerals, petrochemicals, defence).

## Features

- **Business Model Canvas Management**: Hierarchical canvas creation and management
- **Location Validation**: Real-time city, state, country validation using Geoapify API
- **Strategic Planning**: Multi-step business information collection
- **Risk Management**: Critical Controls Theory integration
- **Modern UI**: Built with Next.js 15+, React 18+, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Geoapify API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CapOpt-Platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
# Geoapify API Configuration
# Get your free API key from: https://www.geoapify.com/
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key_here

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/capopt_platform"

# Authentication (if using)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Geoapify API Setup

The application uses Geoapify API for location validation and autocomplete. To set this up:

1. Visit [https://www.geoapify.com/](https://www.geoapify.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add the API key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GEOAPIFY_API_KEY=your_actual_api_key_here
   ```

### Features Provided by Geoapify Integration

- **Location Autocomplete**: Real-time suggestions as you type
- **City, State, Country Validation**: Automatic parsing and validation
- **Geocoding**: Convert addresses to coordinates
- **Address Formatting**: Standardized address formats
- **Error Handling**: Graceful fallback when API is unavailable

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed the database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations

## Technology Stack

- **Frontend**: Next.js 15+, React 18+, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **UI Components**: shadcn/ui
- **Location Services**: Geoapify API
- **Authentication**: NextAuth.js (optional)

## Project Structure

```
CapOpt-Platform/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── business-canvas/   # Business canvas components
│   └── navigation/        # Navigation components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── prisma/                # Database schema and migrations
├── docs/                  # Documentation
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved. 