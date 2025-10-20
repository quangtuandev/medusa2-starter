# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo containing a Medusa v2 e-commerce backend and a Remix storefront. The project showcases a coffee-themed storefront with Stripe payment integration.

## Architecture

- **Monorepo Structure**: Uses Turborepo for orchestrating multiple applications
- **Backend**: Medusa v2 headless commerce platform in `apps/medusa/`
- **Frontend**: Remix-based storefront in `apps/storefront/`
- **Database**: PostgreSQL with MikroORM
- **Caching/Events**: Redis (in-memory for tests)
- **Package Manager**: Yarn 4.5.0 with workspaces

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

# Start only Medusa backend
cd apps/medusa && yarn dev

# Start only storefront
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
- `apps/medusa/.env`: Backend configuration (database, Redis, Stripe, CORS)
- `apps/storefront/.env`: Frontend configuration (Medusa URL, publishable keys)

### Important Files
- `turbo.json`: Turborepo task configuration
- `apps/medusa/medusa-config.ts`: Medusa framework configuration
- `apps/medusa/package.json`: Medusa-specific scripts and dependencies
- `.cursor/rules/`: Cursor IDE rules for Medusa v2 development patterns

## Medusa v2 Architecture Patterns

### Module Structure
- Modules are self-contained packages in `apps/medusa/src/modules/`
- Each module defines its service, data models, and API endpoints
- Modules are registered in `medusa-config.ts`

### API Routes
- Admin APIs: `apps/medusa/src/api/admin/`
- Store APIs: `apps/medusa/src/api/store/`
- Use `MedusaRequest` and `MedusaResponse` types
- Implement validation with Zod schemas

### Services
- Extend `MedusaService` for CRUD operations
- Use dependency injection via `req.scope.resolve()`
- Custom business logic methods go in service classes

### Workflows
- Multi-step business processes in `apps/medusa/src/workflows/`
- Handle complex operations like order processing
- Include compensation steps for error handling

## Development Workflow

1. Always run `yarn dev` from root to start both services
2. Admin panel available at: http://localhost:9000/app/login
   - Email: admin@medusa-test.com
   - Password: supersecret
3. Storefront available at: http://localhost:3000
4. Create Publishable API Keys in Medusa admin for storefront integration
5. Use the Cursor rules in `.cursor/rules/medusa-development.mdc` for guidance on Medusa v2 patterns

## Testing Strategy

- Unit tests for individual functions and utilities
- Integration tests for modules and API endpoints
- HTTP integration tests for full API workflows
- Tests use Jest with custom Medusa test utilities
- Test files should follow the pattern: `*.test.ts`

## Production Deployment

- Use Docker containers (see `Dockerfile` in each app)
- Environment-specific configurations in `.env` files
- Database migrations run automatically on deployment
- Use Redis for caching and events in production