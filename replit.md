# SolarPak - Solar Energy Donation Platform

## Overview

SolarPak is a comprehensive web application that facilitates donations for solar energy installations in Pakistan. The platform addresses the electricity crisis in Pakistan by connecting donors with families in need of sustainable energy solutions. Built with modern web technologies, it provides a seamless donation experience with real-time impact tracking and comprehensive user management.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **Tailwind CSS** with custom design system for responsive UI
- **Radix UI** components for accessible, unstyled UI primitives
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript for type safety
- **RESTful API** design with structured endpoints
- **Passport.js** with local strategy for authentication
- **Session-based authentication** with PostgreSQL session storage
- **Express sessions** with connect-pg-simple for persistent sessions
- **WebSocket** server for real-time updates and notifications

### Database Layer
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations and migrations
- **Neon Database** as the serverless PostgreSQL provider
- **Schema-first approach** with shared TypeScript types

## Key Components

### Authentication System
- Local authentication with email/password
- Secure password hashing with bcrypt
- Session-based authentication with PostgreSQL storage
- Role-based access control (user, member, admin)
- User registration and login flows

### Donation System
- Simple donation recording without payment processing
- Automatic membership tier updates based on donation amounts
- Donation tracking and success confirmation
- User impact metrics and progress tracking

### User Management
- Comprehensive user profiles with donation history
- Membership tier system (Bronze, Silver, Gold, Platinum)
- Admin dashboard for user management
- Real-time user impact tracking
- Media upload capabilities for impact stories

### Content Management
- Dynamic project management system
- Impact story creation and display
- Testimonial management
- Real-time statistics tracking
- Newsletter subscription system

## Data Flow

### User Registration/Login
1. User submits credentials through React form
2. Frontend validates with Zod schema
3. Backend authenticates with Passport.js
4. Session created and stored in PostgreSQL
5. User redirected to appropriate dashboard

### Donation Process
1. User selects donation amount and type
2. Stripe payment intent created on backend
3. Payment processed through Stripe Elements
4. Webhook confirms payment success
5. User donation stats and membership tier updated
6. Real-time impact metrics refreshed

### Admin Operations
1. Admin authentication required for protected routes
2. CRUD operations for projects, stories, and testimonials
3. User management with role/tier updates
4. File upload handling for media content
5. Real-time notifications via WebSocket

## External Dependencies

### Data Processing
- Real-time donation tracking and statistics
- Automated membership tier calculation
- WebSocket notifications for admin updates

### Database
- **Neon Database** for serverless PostgreSQL hosting
- Connection pooling for optimal performance
- Automated backups and scaling

### File Storage
- Local file storage for uploaded media
- Public directory serving for static assets
- Multer middleware for multipart form handling

### Real-time Communication
- **WebSocket** server on port 8081
- Real-time notifications for admin actions
- Live impact tracking updates

## Deployment Strategy

### Development Environment
- **Replit** as the primary development platform
- Hot module replacement with Vite
- PostgreSQL module for database provisioning
- Development server on port 5000

### Production Build
- Vite build for optimized frontend bundle
- ESBuild for server-side code compilation
- Static file serving from dist directory
- Environment-specific configuration

### Database Migrations
- Drizzle Kit for schema migrations
- Automatic migration on deployment
- Seed data for initial admin accounts

### Environment Configuration
- Environment variables for sensitive data
- Stripe keys for payment processing
- Database connection strings
- Session secrets for security

## Changelog

- July 6, 2025. Removed PayPal integration - system now tracks donations without payment processing
- July 3, 2025. Replaced Stripe with PayPal integration for donation processing
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.