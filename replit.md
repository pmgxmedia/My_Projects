# PMGXmedia - Project Experience Platform

## Overview

PMGXmedia is a professional portfolio and project management platform designed as a "Project Experience Platform" (PXP). Unlike traditional portfolios, each project is treated as a living digital asset with its own unique identity, performance metrics, and conversion flow. The platform enables software developers to showcase their work with verifiable data, analytics tracking, and client engagement features.

Key features include:
- Project showcase with unique handle IDs (e.g., `/p/proj-xxx-XXXX`)
- Real-time analytics and engagement tracking
- Client enquiry and feedback systems
- Admin dashboard for content management
- Resume management and file uploads
- Customizable site settings (hero text, announcements)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful JSON API under `/api/*` prefix
- **Development**: tsx for TypeScript execution, Vite dev server with HMR proxy
- **Production Build**: esbuild bundles server to CommonJS, Vite builds client to static files

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Connection**: pg Pool with `DATABASE_URL` environment variable

### Key Data Models
- **Users**: Authentication with username/password
- **Projects**: Core content with handleId, title, technologies, impact metrics
- **Analytics Events**: View tracking, engagement scoring
- **Enquiries**: Client contact requests linked to projects
- **Feedback**: Professional assessments with efficiency/clarity/innovation scores
- **Resumes**: Uploadable resume files with visibility toggle
- **Site Settings**: Key-value store for hero text and announcements

### File Upload Architecture
- **Object Storage**: Google Cloud Storage via Replit sidecar integration
- **Upload Flow**: Two-step presigned URL pattern
  1. Client requests presigned URL from `/api/uploads/request-url`
  2. Client uploads directly to GCS using the presigned URL
- **Client Library**: Uppy with AWS S3 plugin (compatible with GCS)

### Routing Structure
- `/` - Home page with project grid
- `/solutions` - Services offered
- `/about` - Developer profile
- `/insights` - Blog/articles (coming soon)
- `/p/:handleId` - Individual project detail pages
- `/admin` - Protected dashboard for content management

## External Dependencies

### Core Services
- **PostgreSQL Database**: Required via `DATABASE_URL` environment variable
- **Google Cloud Storage**: Object storage via Replit sidecar at `127.0.0.1:1106`

### Key NPM Packages
- **Database**: `drizzle-orm`, `drizzle-kit`, `pg`
- **Validation**: `zod`, `drizzle-zod`, `zod-validation-error`
- **UI Framework**: Full shadcn/ui component suite (`@radix-ui/*` primitives)
- **Data Fetching**: `@tanstack/react-query`
- **File Uploads**: `@uppy/core`, `@uppy/aws-s3`, `@uppy/dashboard`
- **Charts**: `recharts`
- **Forms**: `react-hook-form`, `@hookform/resolvers`

### Fonts (External)
- Space Grotesk (display headings)
- Inter (body text)
- JetBrains Mono (code/technical elements)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `PUBLIC_OBJECT_SEARCH_PATHS`: Optional paths for public object access