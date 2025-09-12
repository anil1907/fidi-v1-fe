# Overview

Nutrisyonel is a modern, comprehensive dietitian management system built for Turkish-speaking professionals. The application provides tools for managing clients, creating reusable diet templates, generating personalized diet plans, and scheduling appointments. It features a responsive design with dark/light theme support and focuses on providing an intuitive user experience for nutrition professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe development
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **State Management**: 
  - Zustand for client-side state management (UI states, filters, modals)
  - TanStack Query (React Query) for server state management with caching and optimistic updates
- **Form Handling**: React Hook Form with Zod for schema validation
- **Internationalization**: Turkish (tr-TR) as the default locale with date-fns for date formatting
- **UI Components**: Radix UI primitives through shadcn/ui for accessibility and consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with comprehensive CRUD operations for all resources
- **Storage**: In-memory storage implementation with interface for easy database migration
- **Development**: Hot module replacement with Vite integration for seamless development experience

### Data Models
The application manages four core entities:
- **Users**: Authentication and system access
- **Clients**: Dietitian's patients with personal information and goals
- **Templates**: Reusable diet plan templates with meal sections and items
- **Diet Plans**: Personalized plans assigned to clients based on templates
- **Appointments**: Scheduling system for client consultations

### Component Architecture
- **Layout Components**: Fixed sidebar navigation with responsive topbar
- **Feature Components**: Modular components for each domain (clients, templates, plans, appointments)
- **UI Components**: Reusable shadcn/ui components with consistent styling
- **Form Components**: Validated forms with error handling and optimistic updates
- **Common Components**: Shared utilities like empty states, confirmation dialogs, and loading states

### Development Patterns
- **File Organization**: Feature-based folder structure with shared utilities
- **Type Safety**: Comprehensive TypeScript usage with Zod schema validation
- **Error Handling**: Graceful error boundaries with user-friendly messages
- **Performance**: Optimized with React Query caching and lazy loading
- **Testing**: Test-friendly component structure with data-testid attributes

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database with Neon Database serverless integration
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Drizzle Kit**: Database schema management and migration tools

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: High-quality React components built on Radix UI primitives
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Consistent icon library for the entire application

### State & Forms
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation for forms and API responses
- **Zustand**: Lightweight state management for UI state

### Date & Internationalization
- **date-fns**: Modern date utility library with Turkish locale support
- **Turkish Locale**: Full Turkish language support for dates, formatting, and UI text

### Development Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **ESLint & Prettier**: Code quality and formatting tools
- **TypeScript**: Static type checking for enhanced developer experience
- **Replit Integration**: Development environment optimized for Replit deployment

### Runtime & Deployment
- **Express.js**: Web application framework for Node.js
- **Node.js**: JavaScript runtime for server-side operations
- **Environment Variables**: Configuration management for different deployment environments