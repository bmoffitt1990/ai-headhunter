# AI Headhunter

A modern resume builder application powered by AI, built with Next.js, TypeScript, and Supabase.

## Features

- **AI-Powered Resume Generation**: Leverage artificial intelligence to create compelling resume content
- **Professional Templates**: Choose from a variety of modern, ATS-friendly templates
- **Real-time Editing**: Edit your resume with live preview
- **Multiple Export Formats**: Download as PDF, Word document, or share online
- **User Authentication**: Secure user accounts with Supabase Auth
- **Cloud Storage**: Save and sync your resumes across devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: Vercel
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-headhunter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See [docs/environment-setup.md](docs/environment-setup.md) for detailed setup instructions.

4. Set up the database:
- Run the SQL commands in `docs/database-schema.sql` in your Supabase SQL editor

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── shared/         # Shared layout components
├── features/           # Feature-based modules
│   └── resume/         # Resume-related components
│       ├── components/ # Resume-specific components
│       ├── hooks/      # Resume-related hooks
│       ├── types/      # Resume type definitions
│       └── utils/      # Resume utility functions
├── lib/                # Utility libraries
│   ├── supabase/       # Supabase client and auth
│   ├── validations/    # Zod schemas
│   └── utils/          # Helper functions
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Configuration

### TypeScript
- Strict mode enabled with additional safety checks
- Path aliases configured for clean imports
- Comprehensive compiler options for Next.js App Router

### ESLint & Prettier
- Next.js TypeScript preset
- Prettier integration for consistent formatting
- Custom rules for code quality

### Tailwind CSS
- Custom design tokens and spacing
- Dark mode support
- Component variants and animations
- Optimized for Shadcn/ui components

### Supabase Integration
- Client and server-side configurations
- Authentication context and providers
- Row Level Security (RLS) policies
- Type-safe database operations

## Deployment

The application is configured for deployment on Vercel with:
- Automatic builds and deployments
- Environment variable management
- Performance optimizations
- Custom domain support

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

## Documentation

- [Environment Setup](docs/environment-setup.md) - Environment variables and Supabase configuration
- [Database Schema](docs/database-schema.sql) - Complete database setup
- [Deployment Guide](docs/deployment.md) - Step-by-step deployment instructions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `npm run lint && npm run type-check`
5. Format code: `npm run format`
6. Submit a pull request

## License

This project is licensed under the MIT License.
