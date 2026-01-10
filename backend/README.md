# Journi Backend API

Express.js REST API backend for the Journi application with PostgreSQL database.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

Make sure PostgreSQL is installed and running on your system.

Create a database:
```bash
createdb journi_db
```

Or using PostgreSQL CLI:
```sql
CREATE DATABASE journi_db;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/journi_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=4000
```

### 4. Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
npm run db:seed
```

This will create:
- Sample categories (Sightseeing, Entertainment, Adventure)
- Sample experiences
- Test user (email: `test@example.com`, password: `password123`)

### 6. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)
- `PUT /api/auth/password` - Change password (requires auth)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Experiences
- `GET /api/experiences` - Get experiences (with filters: category, featured, isNew, search, limit, cursor)
- `GET /api/experiences/:slug` - Get experience by slug

### Bookings
- `GET /api/bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `POST /api/bookings` - Create booking (requires auth)
- `PUT /api/bookings/:id/status` - Update booking status (requires auth)
- `POST /api/bookings/:id/cancel` - Cancel booking (requires auth)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (requires auth)
- `POST /api/wishlist` - Add to wishlist (requires auth)
- `DELETE /api/wishlist/:experienceId` - Remove from wishlist (requires auth)

### Reviews
- `GET /api/reviews/experience/:experienceId` - Get reviews for an experience
- `POST /api/reviews` - Create review (requires auth)
- `PUT /api/reviews/:id` - Update review (requires auth)
- `DELETE /api/reviews/:id` - Delete review (requires auth)

### Messages
- `GET /api/messages` - Get user's messages (requires auth)
- `GET /api/messages/:id` - Get message by ID (requires auth)
- `POST /api/messages` - Create message (requires auth)
- `PUT /api/messages/:id/read` - Mark message as read (requires auth)
- `DELETE /api/messages/:id` - Delete message (requires auth)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Management

### Prisma Studio (Database GUI)
```bash
npm run db:studio
```

### Create Migration
```bash
npm run db:migrate
```

### Generate Prisma Client
```bash
npm run db:generate
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

