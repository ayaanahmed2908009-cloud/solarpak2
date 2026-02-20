# SolarPak - Solar Energy Donation Platform

## Overview
SolarPak is a web application dedicated to facilitating donations for solar energy installations in Pakistan. Its primary purpose is to address Pakistan's electricity crisis by connecting donors with families in need of sustainable energy solutions. The platform aims to provide a seamless donation experience with real-time impact tracking and efficient internal management, ultimately contributing to widespread solar adoption in the region.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
SolarPak operates as a dual-platform system: a Public Donation Platform accessible without authentication, and a secure Worker Management System for internal team members.

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for responsive UI
- **Radix UI** for accessible components
- **Wouter** for routing
- **TanStack Query** for server state
- **React Hook Form** with Zod for forms

### Backend
- **Express.js** with TypeScript
- **RESTful API**
- **Dual Authentication**: No auth for public routes; session-based auth with bcrypt for workers.
- **Express sessions** with `connect-pg-simple`
- **WebSocket** server for real-time updates

### Database
- **PostgreSQL** (Neon Database)
- **Drizzle ORM** for type-safe operations and migrations
- **Schema-first approach** with shared TypeScript types
- **Dual Schema Design**: `public` and `worker` schemas

### Key Features
- **Public Platform**: Open access, no authentication, direct Ko-fi integration for donations.
- **Worker Management System**: Secure login, role-based access (Admin, Manager, Worker), department organization, activity tracking, admin features.
- **Donation System**: Direct integration with Ko-fi.com for payment processing, automatic membership tier updates based on donations, impact tracking.
- **Content Management**: Dynamic project management, impact stories, testimonials, real-time statistics, newsletter.
- **Impact Labs**: Article/report publishing system. Team members sign in at `/impactlabs` with a shared password (env var `IMPACT_LABS_PASSWORD`, default `solarpak2025`) to write, format (rich text editor), and publish articles. Public articles visible at `/impact-labs` and as a section on the homepage. Articles stored in `impact_labs_articles` table with title, slug, summary, content (HTML), cover image, author, category, tags, and publish status.
- **Opportunities Page**: Public page at `/opportunities` showcasing SolarPak's organizational structure (7 departments with expandable role details) and current volunteer/internship opportunities pulled from `job_listings` database table. Each listing has an inline application form that submits to `job_applications` table.
- **Admin Panel**: Password-protected admin dashboard at `/admin` (password: env var `ADMIN_PASSWORD`, default `ayaanahmed`). Manages job listings (create, toggle active/hidden, delete) and reviews applications (status: pending/reviewed/accepted/rejected). Uses session-based auth similar to Impact Labs pattern.
- **SEO Optimization**: Comprehensive meta tags, Open Graph, Twitter Card, structured data, XML sitemap, `robots.txt`, keyword-optimized content.

## External Dependencies
- **Neon Database**: Serverless PostgreSQL hosting.
- **Ko-fi**: Primary platform for processing all donations.
- **Multer**: Middleware for handling multipart form data (e.g., file uploads).
- **WebSocket**: For real-time communication and notifications.