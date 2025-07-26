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
- Direct Ko-fi integration with simple redirect buttons
- No internal donation forms - all payments processed through Ko-fi.com/solarpak
- Automatic membership tier updates based on donation amounts
- Donation tracking and success confirmation
- User impact metrics and progress tracking
- Streamlined user experience with external payment processing

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

### SEO Optimization
- Comprehensive meta tags for search engines and social media
- Open Graph and Twitter Card integration
- Structured data (JSON-LD) for organizations and websites
- XML sitemap for search engine crawling
- Robots.txt for crawler guidelines
- SEO-optimized content with targeted keywords
- Location-specific content for Pakistani regions
- FAQ section with structured data markup
- Blog-style content for better search visibility

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

- July 27, 2025. Updated team statistics: Changed team member count from 12 to 9 members
- July 27, 2025. Updated team achievements: Added content production willingness achievement to Jonathan Joseph
- July 27, 2025. Updated team expertise: Added "Cold Outreach" and "Brand Image" to Jonathan Joseph's expertise areas
- July 27, 2025. Updated team achievements: Changed Roham Jan's achievement to "Grew social media account by 30% in likes"
- July 27, 2025. Updated team expertise: Added "Content Creation" and "Engagement" to Roham Jan's expertise areas
- July 27, 2025. Updated social links: Removed LinkedIn and Twitter from all team members, keeping only email contacts
- July 27, 2025. Updated founder photo: Added Ayaan Ahmed's actual photo showing desert landscape triumph
- July 27, 2025. Updated board directors: Added "Influences major strategic decisions through board participation" to all directors' achievements
- July 27, 2025. Updated founder details: Changed location to Riyadh, Saudi Arabia and founding date to March 2025
- July 27, 2025. Updated team photos: Added Adnan Syed's actual photo to Community Liaison profile
- July 27, 2025. Updated team dates: Changed all team members' join dates to July 2025
- July 27, 2025. Updated team roles: Changed Jonathan Joseph's title to "Head of Event and Brand Promotion"
- July 27, 2025. Updated team photos: Added Roham Jan's actual professional photo to Social Media Manager profile
- July 27, 2025. Updated social links: Added Ayaan Ahmed's LinkedIn profile to Events Director
- July 27, 2025. Updated social links: Removed LinkedIn links from all directors except founder, added Zaid Afal's LinkedIn profile
- July 27, 2025. Updated all directors: Added "Member of board of directors" to all four department directors' achievements
- July 27, 2025. Updated Predictive Systems & Healthcare: Added Moiz Ali as Director with achievements in healthcare expansion and board leadership
- July 27, 2025. Updated team structure: Removed placeholder outreach coordinators 3 and 4 from Events team
- July 27, 2025. Updated Sponsorships & Fundraising: Added Ramin Tihami as Director with expertise in AI-powered outreach and strategic negotiations
- July 27, 2025. Updated Events & Community Outreach: Added Zaid Afal as Event Coordinator with expertise in community relations and organisation
- July 27, 2025. Updated Events & Community Outreach: Added Adnan Syed as Community Liaison with expertise in community relations, organisation, and talent acquisition
- July 27, 2025. Updated Events & Community Outreach: Added Ayaan Omer as Director with achievements in organizing 10 events and clash royale competition
- July 27, 2025. Updated Social Media team: Added Roham Jan as Social Media Manager with expertise in editing and CapCut, achievements in posting and engagement
- July 27, 2025. Updated Social Media team: Added Jonathan Joseph as Content Creator specializing in brand promotion content, graphic design, and Canva
- July 27, 2025. Enhanced team profile layouts: All team members now have same professional layout as directors with larger photos and consistent spacing
- July 27, 2025. Added Ibrahim Murtaza's actual profile photo with blue frame border in updated layout structure
- July 27, 2025. Created comprehensive Team page with team member profiles, mission & values, and career opportunities
- July 27, 2025. Added Trust Roadmap Section with animated 3-step donation workflow before donation section
- July 27, 2025. Updated Trust Roadmap icons to visible emojis with white backgrounds and green borders
- July 18, 2025. Implemented comprehensive SEO optimization including meta tags, structured data, sitemap, and content optimization
- July 18, 2025. Updated impact statistics: 8 solar panels, 8 homes, 35 lives transformed, 90 kWh energy, 120 kg CO₂ prevented
- July 18, 2025. Enhanced mobile responsiveness for counter animations and impact section
- July 18, 2025. Replaced "Night Mercy" messaging with unified "Blessed Giving" theme
- July 6, 2025. Completely removed donation forms - all donations now handled through Ko-fi.com/solarpak
- July 6, 2025. Added Ko-fi integration - donations now redirect to ko-fi.com/solarpak for payment processing
- July 6, 2025. Removed PayPal integration - system now tracks donations without payment processing
- July 3, 2025. Replaced Stripe with PayPal integration for donation processing
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.