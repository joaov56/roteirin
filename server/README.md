# Roteirin Server

Backend for travel itinerary generator using Fastify, TypeScript, and PostgreSQL with TypeORM.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

## Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```sql
   CREATE DATABASE roteirin;
   ```
3. Configure your database connection in the `.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=roteirin
   ```
4. Run the database setup script:
   ```bash
   npm run db:setup
   ```
5. Test the database connection:
   ```bash
   npm run db:test
   ```

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The server will automatically connect to the PostgreSQL database and create the necessary tables based on the TypeORM entities.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Itineraries

- `GET /api/itineraries` - Get all itineraries for the authenticated user
- `POST /api/itineraries` - Create a new itinerary
- `GET /api/itineraries/:id` - Get a specific itinerary
- `PUT /api/itineraries/:id` - Update an itinerary
- `DELETE /api/itineraries/:id` - Delete an itinerary

## TypeORM Commands

- Generate a migration:

  ```bash
  npm run migration:generate -- src/migrations/MigrationName
  ```

- Run migrations:

  ```bash
  npm run migration:run
  ```

- Setup database (initialize and run migrations):

  ```bash
  npm run db:setup
  ```

- Test database connection:
  ```bash
  npm run db:test
  ```
