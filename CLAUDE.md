# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo implementing a modern e-commerce platform combining Medusa v2 (headless commerce backend) with a React Router v7 storefront. The project showcases a coffee-themed storefront with multi-payment support (Stripe, PayPal, Bank Transfer) and custom commerce modules.

## Architecture

- **Monorepo Structure**: Turborepo v2.1.2 for orchestrating multiple applications
- **Backend**: Medusa v2.7.0 headless commerce platform in `apps/medusa/`
- **Frontend**: React Router v7.5.3 storefront (Remix migration) in `apps/storefront/`
- **Database**: PostgreSQL 16 with MikroORM 6.4.16
- **Caching/Events**: Redis (production) / In-memory (tests)
- **Package Manager**: Yarn 4.5.0 with workspaces
- **Code Quality**: Biome 1.9.3 (formatting/linting), TypeScript 5.6+ (strict mode)

## Development Commands

### Setup
```bash
# Install dependencies
yarn

# Generate environment files
yarn run generate-env

# Initialize Medusa database (first time only)
yarn run medusa:init
```

### Development
```bash
# Start both backend and frontend in development mode
yarn dev

# Start only Medusa backend (API runs on port 7901)
cd apps/medusa && yarn dev

# Start only storefront (dev server on port 7910)
cd apps/storefront && yarn dev
```

### Building & Production
```bash
# Build all applications
yarn build

# Start production servers
yarn start

# Type checking
yarn typecheck

# Linting
yarn lint

# Formatting
yarn format
```

### Testing (Medusa Backend)
```bash
# Run unit tests
cd apps/medusa && yarn test:unit

# Run integration tests (modules)
cd apps/medusa && yarn test:integration:modules

# Run integration tests (HTTP)
cd apps/medusa && yarn test:integration:http
```

### Database Management
```bash
# Reset database (Docker)
cd apps/medusa && yarn nukedb

# Run migrations
cd apps/medusa && yarn migrate

# Seed data
cd apps/medusa && yarn seed

# Add admin users
cd apps/medusa && yarn add-user
```

## Key Configuration

### Environment Variables
- `apps/medusa/.env`: Backend configuration (PostgreSQL, Redis, Stripe API key, CORS origins)
- `apps/storefront/.env`: Frontend configuration (Stripe/PayPal public keys, Medusa publishable key, EmailJS credentials)
- Generate templates: `yarn run generate-env`

### Important Files & Configuration
- `turbo.json`: Turborepo task pipeline (build, dev, start, typecheck, lint, format)
- `biome.json`: Code formatting (2 spaces, single quotes, 120 char line width) and import organization
- `apps/medusa/medusa-config.ts`: Medusa framework setup (plugins, payment providers, database, Redis)
- `apps/medusa/jest.config.js`: Test configuration for unit/integration/HTTP tests
- `apps/storefront/vite.config.ts`: Vite with React Router v7 and SSR configuration
- `apps/storefront/tailwind.config.js`: Tailwind CSS styling system
- `.cursor/rules/`: 9 IDE guidance files covering Medusa patterns, Remix/React Router, TypeScript, testing strategies

## Medusa v2 Backend Architecture

### Module Structure
Modules are self-contained packages in `apps/medusa/src/modules/`:
- **blog**: Post CMS functionality with migrations and database models
- **product-reviews**: Customer review system with rating functionality
- **bank-account**: Bank account management with admin API integration
- **bank-transfer**: Custom payment provider for bank transfer checkout
- Each module defines: service class, data models, migrations, and API endpoints
- Register modules in `medusa-config.ts`

### API Routes
- Admin APIs: `apps/medusa/src/api/admin/`
- Store APIs: `apps/medusa/src/api/store/` (17 route files for checkout, cart, reviews, etc.)
- Use `MedusaRequest` and `MedusaResponse` types for type safety
- Implement validation with Zod schemas
- All routes support JSON request/response bodies

### Services
- Extend `MedusaService` for CRUD operations
- Use dependency injection via `req.scope.resolve(ServiceName)`
- Custom business logic in service methods
- Database access via MikroORM repositories

### Workflows
- Multi-step business processes in `apps/medusa/src/workflows/`
- Handle complex operations like order processing
- Include compensation steps for error handling and rollback
- Example: `create-post.ts` for blog post creation workflow

### Payment Integration
- **Stripe**: Built-in provider configured in `medusa-config.ts`
- **PayPal**: Via `@alphabite/medusa-paypal` v0.2.4 plugin
- **Bank Transfer**: Custom implementation in bank-transfer module
- Payment provider registration in config file

## Frontend Architecture (React Router v7 Storefront)

### Route Structure
- **47 route files** in `apps/storefront/app/routes/`
- File-based routing with React Router v7 conventions
- Key routes: home (`_index.tsx`), checkout, cart management, product pages, account, about
- API endpoints: `api.checkout.*`, `api.cart.*`, `api.product-reviews.create`
- SEO: Sitemap generation and structured data support
- Apple Pay: Merchant ID domain association configured

### Component Organization
- **19 component subdirectories** in `apps/storefront/app/components/`
- `cart/`, `checkout/`, `product/`, `collection/`, `reviews/`, `layout/`, `common/` (reusable), `home/`, `sections/`
- Tailwind CSS for styling with custom configuration
- Responsive design patterns for mobile/tablet/desktop
- Form handling with React Hook Form + Zod validation

### State Management
- **Zustand** v4.4.7 for global state (cart, user, checkout state)
- **React Context** for theme/locale providers (Medusa SDK, Stripe, PayPal, Cart providers)
- i18n with **i18next** v25.3.6 for multi-language support

### Data Fetching & Integration
- **Medusa JS SDK** v2.7.0 for API calls to backend
- **Stripe React** integration for payment UI
- **PayPal React** integration for alternate payments
- **React Router loaders/actions** for data fetching and form submission
- Publishable API Key authentication with Medusa

### Code Quality
- TypeScript strict mode throughout
- Path aliases: `@app/*` for routes, `@ui-components/*` for shared components, `@libs/*` for utilities
- Biome formatting (2 spaces, single quotes)
- Component-level error boundaries and loading states

## Development Workflow

1. **Initial Setup**: `yarn && yarn run generate-env && yarn run medusa:init`
2. **Start Development**: `yarn dev` from root (both services)
3. **Admin Panel**: http://localhost:9000/app/login (admin@medusa-test.com / supersecret)
4. **Storefront**: http://localhost:3000 (dev) or :7109 (prod)
5. **API Keys**: Create Publishable API Key in Medusa admin → add to storefront `.env`
6. **Cursor Rules**: Use `.cursor/rules/medusa-development.mdc` for Medusa patterns and `.cursor/rules/remix-storefront-*.mdc` for frontend patterns

## Testing Strategy

### Backend (Medusa)
- **Unit tests**: Individual functions/utilities in `__tests__/*.unit.spec.ts`
- **Module integration**: Module endpoints/services in `src/modules/*/__tests__/**/*.ts`
- **HTTP integration**: Full API workflows in integration-tests directories
- Run: `cd apps/medusa && yarn test:unit|test:integration:modules|test:integration:http`

### Frontend
- Component testing with Vitest/Jest
- RTL (React Testing Library) for component behavior
- E2E testing with Playwright (when configured)

### Test Organization
- Jest configuration in `apps/medusa/jest.config.js`
- Test patterns: `*.unit.spec.ts`, `*.spec.ts`, `*.test.ts`
- Medusa test utilities for database/service mocking

## Production Deployment

### Docker & Container Setup
- Multi-stage Docker builds in `apps/medusa/Dockerfile` and `apps/storefront/Dockerfile`
- Base image: Node 20-Alpine with libc6-compat
- Production optimization: Turbo prune for dependency reduction

### Infrastructure
- **PostgreSQL 16**: Database on port 5432 (volumes for persistence)
- **Redis**: Caching/events on port 6379 (used in production config)
- Environment-specific `.env` files for secrets and configuration
- Database migrations run automatically on startup

### Process Management
- **PM2 Config**: `ecosystem.config.js` for process management in production
- Auto-restart on failure, 1GB memory limit per process
- Health check endpoints available for monitoring

### Environment Configuration
- Database: `DATABASE_URL=postgresql://...`
- Redis: `REDIS_URL=redis://...`
- Stripe/PayPal: API keys in `.env`
- CORS: Configure `STORE_CORS`, `ADMIN_CORS` for allowed origins