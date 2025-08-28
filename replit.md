# Overview

PaintCompare is a comprehensive paint industry competitive intelligence web application built for paint manufacturers and retailers. The system enables users to track their product catalog, monitor competitor pricing, and analyze market competitiveness through an intuitive dashboard interface. Built as a full-stack TypeScript application, it provides real-time price tracking, competitive analysis, and business intelligence features specifically tailored for the paint and coatings industry.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React 18 using TypeScript and follows a modern component-based architecture. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching. The UI framework is based on shadcn/ui components with Radix UI primitives, styled using Tailwind CSS with a custom design system featuring paint industry-specific color schemes.

The frontend follows a feature-based folder structure with shared components, hooks, and utilities. Form handling is managed through React Hook Form with Zod validation schemas shared between client and server. The application supports both desktop and mobile interfaces with responsive design patterns.

## Backend Architecture  
The server is built with Express.js and follows a RESTful API design pattern. The application uses a modular route structure with separated concerns for different entities (products, competitors, competitor prices, price history). The backend implements a storage abstraction layer that currently uses in-memory storage but is designed to easily swap to database implementations.

The server includes middleware for request logging, JSON parsing, and error handling. API routes are fully typed using shared schemas, ensuring type safety across the entire stack. The backend supports CRUD operations for all major entities and includes analytics endpoints for dashboard KPIs.

## Data Storage Solutions
The application is configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for products, competitors, competitor prices, and price history with proper foreign key relationships. The application uses UUID primary keys and includes automatic timestamp tracking.

Drizzle is configured with migrations support and includes Zod schema generation for runtime validation. The storage layer implements a repository pattern with a clean interface that supports both in-memory storage (for development/testing) and database persistence.

## Authentication and Authorization
Currently, the application includes basic user interface elements (avatar, user name display) but does not implement full authentication. The frontend shows placeholder user information and the backend does not include session management or user authentication middleware. This appears to be designed for future implementation.

## External Dependencies
The application integrates with several external services and libraries:

- **Database**: Neon Database serverless PostgreSQL for cloud database hosting
- **UI Components**: Extensive use of Radix UI primitives for accessible, unstyled components
- **Charts and Visualization**: Recharts library for data visualization and trending analysis
- **Date Handling**: date-fns library for date manipulation and formatting
- **Validation**: Zod for runtime type validation and schema definition
- **Development Tools**: Vite for build tooling and development server, with Replit-specific plugins for cloud development environment integration

The application is designed to potentially integrate with external price data APIs and includes a JSONBin service for cloud data synchronization, though this appears to be optional functionality for data backup and sync across devices.