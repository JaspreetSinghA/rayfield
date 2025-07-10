# Rest Express Application

## Overview

This is a full-stack web application built with Express.js for the backend and React with TypeScript for the frontend. The application uses a modern tech stack including Drizzle ORM for database management, shadcn/ui for UI components, and TanStack Query for state management. The project is configured for PostgreSQL as the primary database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Driver**: Neon Database serverless driver
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Development**: tsx for TypeScript execution in development

### Build System
- **Frontend**: Vite with React plugin and TypeScript support
- **Backend**: esbuild for production builds
- **Development**: Concurrent development with Vite dev server and Express server

## Key Components

### Database Layer
- **Schema Definition**: Centralized in `shared/schema.ts` using Drizzle ORM
- **Migrations**: Managed through Drizzle Kit with PostgreSQL dialect
- **Current Schema**: User table with id, username, and password fields
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

### API Layer
- **Route Registration**: Centralized in `server/routes.ts`
- **Middleware**: Request logging, JSON parsing, error handling
- **Storage Integration**: Clean interface for CRUD operations
- **Error Handling**: Centralized error middleware with proper status codes

### Frontend Components
- **UI Components**: Complete shadcn/ui component library
- **Pages**: Modular page structure with sign-in page and 404 handling
- **Hooks**: Custom hooks for mobile detection and toast notifications
- **Query Client**: Configured TanStack Query client with custom fetch functions

## Data Flow

1. **Client Requests**: Frontend makes API calls through TanStack Query
2. **API Processing**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Storage interface abstracts database operations
4. **Response Handling**: Structured JSON responses with proper error handling
5. **State Management**: TanStack Query manages caching and synchronization

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database
- **Connection**: Uses DATABASE_URL environment variable
- **ORM**: Drizzle ORM for type-safe database operations

### UI Framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component library

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment
- **TypeScript**: Full type safety across the stack
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Drizzle push for schema synchronization

### Production
- **Frontend**: Static build output to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Serving**: Express serves both API and static files
- **Database**: Drizzle migrations for schema management

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Build**: Node.js ESM modules
- **TypeScript**: Strict mode with modern ES features

## Page Navigation Flow

### Authentication Flow
- **SignIn (/)**: Main login page with navigation to SignUp and Dashboard
- **SignUp (/signup)**: User registration with navigation back to SignIn and to Dashboard

### Dashboard and Core Pages
- **Dashboard (/dashboard)**: Central hub with navigation to all feature pages
- **Profile (/profile)**: User profile management with navigation back to Dashboard

### Feature Pages
- **Flagged Anomalies (/flagged-anomalies)**: System anomaly monitoring and management
- **Export Reports (/export-reports)**: Multi-tab report generation (System, Analytics, Compliance)

### Submission Workflow
- **Upload Submission (/upload-submission)**: File upload interface with navigation to Text Input and Review
- **Text Input (/text-input)**: Direct text input interface with navigation to Upload Submission and Review
- **Review (/review)**: Submission review page with navigation back to edit screens and to final Submission
- **Submission (/submission)**: Final submission status and processing tracking

### Navigation Patterns
- All pages include header navigation with Dashboard and Sign Out options
- Cross-navigation between Upload Submission and Text Input screens
- Linear flow from submission → review → final submission
- Return to Dashboard available from all pages

## Changelog

- July 08, 2025. Initial setup
- July 08, 2025. Added comprehensive page navigation flow with 10 new pages including Flagged Anomalies, Export Reports, and complete submission workflow
- July 08, 2025. Updated application sizing to be fully responsive and utilize entire desktop screen width by removing max-width constraints and implementing full-width layouts

## User Preferences

Preferred communication style: Simple, everyday language.