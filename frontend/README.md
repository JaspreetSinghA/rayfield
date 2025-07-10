# Rayfield Systems Dashboard

A full-stack web application built with React, TypeScript, Express, and Tailwind CSS featuring a comprehensive dashboard interface with data analysis, reporting, and submission workflows.

## Features

- **Dashboard**: Central hub with square card-based navigation
- **User Authentication**: Sign in/sign up flow
- **Data Analysis**: Flagged anomalies monitoring
- **Reporting**: Multi-tab export system (System, Analytics, Compliance)
- **Submission Workflow**: File upload and text input processing
- **Profile Management**: User settings and preferences
- **Responsive Design**: Full-width layouts optimized for desktop

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Wouter** for routing
- **TanStack Query** for state management
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with TypeScript
- **Express.js** REST API
- **Drizzle ORM** (ready for PostgreSQL)
- **In-memory storage** (development)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and config
├── server/                 # Express backend
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Storage interface
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
└── [config files]         # TypeScript, Tailwind, Vite configs
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema (when DB is configured)

## Pages and Navigation

### Main Pages
- **Dashboard** (`/dashboard`) - Central navigation hub with square cards
- **Profile** (`/profile`) - User profile management
- **Flagged Anomalies** (`/flagged-anomalies`) - System monitoring
- **Export Reports** (`/export-reports`) - Report generation

### Submission Workflow
- **Upload Submission** (`/upload-submission`) - File upload interface
- **Text Input** (`/text-input`) - Direct text input
- **Review** (`/review`) - Submission review
- **Submission** (`/submission`) - Final processing status

### Authentication
- **Sign In** (`/`) - User login
- **Sign Up** (`/signup`) - User registration

## Development

### Code Style
- TypeScript strict mode
- ESLint and Prettier configured
- Tailwind CSS for styling
- Component-based architecture

### Database Integration
The project is ready for database integration:
- Drizzle ORM configured for PostgreSQL
- Storage interface abstraction
- Environment variables for DATABASE_URL

### API Endpoints
- `GET /api/user` - Get user profile
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file for production:
```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test your changes thoroughly

## License

This project is proprietary software for Rayfield Systems.