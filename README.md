# AI Resume Builder

A modern resume builder application built with Next.js, TypeScript, Tailwind CSS, and Shadcn/UI.

## Features

- ⚡ Built with Next.js 15 (App Router)
- 🎨 Styled with Tailwind CSS
- 🧩 UI components from Shadcn/UI
- 🌙 Dark mode support
- 📱 Responsive design
- 🔧 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-headhunter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Project Structure

```
ai-headhunter/
├── src/
│   ├── app/              # App Router pages and layouts
│   ├── components/       # Reusable components
│   │   └── ui/          # Shadcn/UI components
│   └── lib/             # Utility functions
├── public/              # Static assets
├── package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Adding New Components

To add new Shadcn/UI components:

```bash
npx shadcn@latest add [component-name]
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (if deploying from root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Click "Deploy"

Your application will be automatically deployed and you'll receive a URL to access it.

### Deploy to Other Platforms

The application can also be deployed to:
- Netlify
- Railway
- Render
- Any platform that supports Node.js

For static export (if needed):
```bash
npm run build
npm run export
```

## Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
