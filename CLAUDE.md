# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ALOP2 is a financial management system for Romanian public institutions, built with:
- **Frontend**: Nuxt 3 (Vue 3) with Quasar UI components and Pinia state management
- **Backend**: AdonisJS 6 (separate backend folder) with Prisma ORM
- **Database**: MySQL

## Key Commands

### Frontend Development (Root Directory)
```bash
# Install dependencies
npm install

# Run development server (default: http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

### Backend Development (backend/ directory)
```bash
cd backend

# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

### Production Deployment
```bash
# Uses PM2 configuration
pm2 start ecosystem.config.cjs
```

## Architecture

### Project Structure
- `/` - Nuxt 3 frontend application
- `/backend` - AdonisJS backend API
- `/prisma` - Database schema and migrations
- `/mvc` - Shared MVC architecture code
- `/knowledge` - Documentation and SQL files

### Frontend Architecture
- **Pages**: File-based routing in `/pages`
- **Components**: Reusable Vue components in `/components`
- **Stores**: Pinia state management in `/stores`
- **Composables**: Vue composition API utilities in `/composables`
- **Server Routes**: Nuxt server API routes in `/server/api`

### Backend Architecture
- **Controllers**: Business logic in `/backend/app/controllers`
- **Models**: Database models in `/backend/app/models`
- **Middleware**: Request middleware in `/backend/app/middleware`
- **Services**: Business services in `/backend/app/services`
- **Validators**: Request validation in `/backend/app/validators`

### Key Features
1. **Budget Management** (bugete)
   - Budget creation and tracking
   - Budget distribution by chapters and articles

2. **Legal Commitments** (angajamente)
   - Commitment registration and validation
   - Budget availability checking
   - Department-based access control

3. **Receptions** (receptii)
   - Goods/services reception tracking
   - Link to commitments

4. **Payment Orders** (ordonantari)
   - Payment order creation
   - Invoice management
   - XML generation for ANAF integration

5. **User Management**
   - JWT authentication
   - Role-based access (GENERAL, CFPP)
   - Department-based permissions

### Database Schema
- Uses Prisma ORM with MySQL
- Key models: User, Session, Buget, Angajament, Receptie, Ordonantare, Factura, Plata
- Relationships defined in `/prisma/schema.prisma`

## Development Guidelines

### State Management
- Uses Pinia stores for global state
- Main stores: `useUserStore`, `useNotificationStore`
- API calls should go through composables or server routes

### API Communication
- Frontend communicates with backend via `/server/api` routes
- Backend exposes RESTful APIs
- Authentication uses JWT tokens stored in cookies

### UI Components
- Uses Quasar UI framework
- Custom components follow Vue 3 Composition API
- Form validation uses Quasar's built-in validators

### Error Handling
- Frontend: Use `useNotificationStore` for user notifications
- Backend: Use AdonisJS exception handling
- Always validate user input on both frontend and backend

## Current Development Status

### Active Development Areas
- Export functionality for budgets (Excel/CSV)
- Display available budget in payment window
- Visa registry implementation
- Bug fixes for invoice selection with multiple suppliers

### Known Issues
- Multiple invoices from same supplier cause selection/cancellation conflicts
- See `todo.txt` for complete bug list and feature requests

## Testing

### Backend Testing
```bash
cd backend
npm run test  # Runs Japa tests
```

### Frontend Testing
No test configuration currently set up for frontend.

## Environment Setup
- Copy `.env.example` to `.env`
- Configure database connection
- Set JWT secrets
- Configure session settings