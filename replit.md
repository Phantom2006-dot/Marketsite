# Overview

This is a single-seller e-commerce marketplace platform designed for AL-MUSLIMAH CLOTHINGS & SHOES. The application provides a customer-facing storefront with category browsing and product details, plus a comprehensive admin dashboard for managing products, categories, and store settings. The platform features WhatsApp integration for customer contact and supports both light and dark themes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. The application uses a single-page architecture with route-based code splitting.

**State Management**: TanStack Query (React Query) for server state management with automatic caching, background updates, and optimistic updates. No global client state management library is used - component state is managed locally with React hooks.

**UI Component Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design system follows a "new-york" style variant with custom theming.

**Design System**: 
- Typography: Inter (body text) and DM Sans (headings/CTAs) from Google Fonts
- Color theming with CSS custom properties supporting light/dark modes
- Responsive grid layouts for categories (3 columns) and products (4 columns on desktop)
- Product-first visual hierarchy with images as hero elements

**Form Handling**: React Hook Form with Zod schema validation for type-safe forms throughout admin panels.

## Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript in ESM module format.

**API Design**: RESTful API with conventional HTTP methods (GET, POST, PATCH, DELETE) organized by resource types (categories, products, settings). All routes are prefixed with `/api`.

**Request Processing**: 
- JSON body parsing with raw body preservation for webhook support
- URL-encoded form data support
- Request/response logging middleware for API endpoints
- Error handling with appropriate HTTP status codes

**Development Mode**: Vite middleware integration for HMR (Hot Module Replacement) in development, serving the React application alongside API routes.

**Production Mode**: Static file serving from the built `dist/public` directory with Express handling both API routes and SPA fallback.

## Data Storage

**Database**: PostgreSQL accessed via Neon's serverless driver with WebSocket support.

**ORM**: Drizzle ORM for type-safe database queries and schema management. Schema definitions are shared between client and server via the `shared/schema.ts` file.

**Schema Design**:
- **users**: Authentication with username/password (no active session management visible)
- **categories**: Hierarchical organization with slug-based URLs, custom ordering, and optional images
- **products**: Full product details including pricing, inventory (quantity), physical specs (size/weight), category relationships, and slug-based URLs
- **productImages**: Multiple images per product with cascade deletion
- **siteSettings**: Singleton configuration for store name, contact methods (WhatsApp, Telegram, Facebook), physical locations, and hero image

**Migrations**: Managed via drizzle-kit with migrations stored in the `/migrations` directory.

**Data Access Pattern**: Repository pattern implemented in `server/storage.ts` with an `IStorage` interface defining all database operations. The actual implementation uses Drizzle ORM queries.

## Authentication & Authorization

**Current State**: Basic login page exists but no session management, password hashing, or route protection is implemented. The admin routes are accessible without authentication.

**Planned Approach**: Session-based authentication using `connect-pg-simple` (already installed) for PostgreSQL session storage. The infrastructure suggests Express sessions will be the authentication mechanism.

## External Dependencies

**Database Service**: Neon (serverless PostgreSQL) - connection managed via `@neondatabase/serverless` package with WebSocket support for connection pooling.

**UI Framework**: Radix UI - provides accessible, unstyled primitive components for building the design system.

**Styling**: Tailwind CSS with PostCSS for processing and autoprefixer for browser compatibility.

**Fonts**: Google Fonts API for Inter and DM Sans typefaces.

**Image Assets**: Static images stored in `attached_assets/generated_images/` directory with Vite alias `@assets` for imports.

**Contact Integration**: WhatsApp Web API for customer contact via `wa.me/` links using phone numbers from site settings.

**Development Tools**:
- Replit-specific plugins for runtime error overlay, cartographer (code mapping), and development banner
- TypeScript for type safety across the entire stack
- ESBuild for server-side bundling in production builds

**Package Management**: npm with lockfile version 3, using ESM modules throughout the project.