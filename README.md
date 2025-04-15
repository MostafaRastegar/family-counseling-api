# Family Counseling Platform API

A RESTful API for a family counseling platform that connects clients with counselors. This MVP provides the core functionality needed to bring the service to market quickly.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Entity Relationships](#entity-relationships)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Features](#features)

## Technology Stack

- **Backend Framework**: NestJS
- **Database**: SQLite with TypeORM
- **Authentication**: JWT-based authentication
- **API Documentation**: Swagger UI
- **Validation**: Class Validator
- **Messaging Integrations**: Telegram, WhatsApp (placeholder implementations)

## Project Overview

This platform allows:
- Counselors to register, create profiles, and offer their services
- Counselors to set their availability schedule
- Clients to search for counselors based on specialties, ratings, and availability
- Session scheduling and management
- Messaging integration with popular messaging platforms
- Rating and review system
- Admin dashboard for monitoring and management

## Project Structure

```
family-counseling-api/
├── src/
│   ├── main.ts                      # Entry point - Swagger setup
│   ├── app.module.ts                # Main module - TypeORM and SQLite setup
│   ├── app.controller.ts            # Main controller
│   ├── app.service.ts               # Main service
│   │
│   ├── common/                      # Shared components
│   │   ├── decorators/              # Custom decorators (like Role)
│   │   ├── dto/                     # Shared DTOs
│   │   ├── entities/                # Base entities
│   │   │   └── base.entity.ts       # Base entity with common fields
│   │   ├── enums/                   # Shared enums (session status, roles)
│   │   ├── filters/                 # Error filters
│   │   ├── guards/                  # Security guards
│   │   └── interfaces/              # Shared interfaces
│   │
│   ├── config/                      # Application configuration
│   │   ├── database.config.ts       # SQLite and TypeORM configuration
│   │   └── swagger.config.ts        # Swagger configuration
│   │
│   ├── auth/                        # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── users/                       # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── consultants/                 # Consultants module
│   │   ├── consultants.module.ts
│   │   ├── consultants.controller.ts
│   │   ├── consultants.service.ts
│   │   ├── entities/
│   │   │   ├── consultant.entity.ts
│   │   │   └── availability.entity.ts
│   │   └── dto/
│   │       ├── create-consultant.dto.ts
│   │       ├── update-consultant.dto.ts
│   │       ├── consultant-filter.dto.ts
│   │       ├── create-availability.dto.ts
│   │       └── update-availability.dto.ts
│   │
│   ├── clients/                     # Clients module
│   │   ├── clients.module.ts
│   │   ├── clients.controller.ts
│   │   ├── clients.service.ts
│   │   ├── entities/
│   │   │   └── client.entity.ts
│   │   └── dto/
│   │       ├── create-client.dto.ts
│   │       └── update-client.dto.ts
│   │
│   ├── sessions/                    # Sessions module
│   │   ├── sessions.module.ts
│   │   ├── sessions.controller.ts
│   │   ├── sessions.service.ts
│   │   ├── entities/
│   │   │   └── session.entity.ts
│   │   └── dto/
│   │       ├── create-session.dto.ts
│   │       └── update-session.dto.ts
│   │
│   ├── reviews/                     # Reviews module
│   │   ├── reviews.module.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   ├── entities/
│   │   │   └── review.entity.ts
│   │   └── dto/
│   │       └── create-review.dto.ts
│   │
│   ├── messaging/                   # Messaging module
│   │   ├── messaging.module.ts
│   │   ├── messaging.controller.ts
│   │   ├── messaging.service.ts
│   │   ├── interfaces/
│   │   │   └── messenger.interface.ts
│   │   └── providers/
│   │       ├── telegram.provider.ts
│   │       └── whatsapp.provider.ts
│   │
│   └── admin/                       # Admin module
│       ├── admin.module.ts
│       ├── admin.controller.ts
│       └── admin.service.ts
│
├── database/                        # SQLite database
│   └── database.sqlite
│
├── test/                            # Test files
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env                             # Environment variables
├── .gitignore
├── nest-cli.json                    # Nest CLI configuration
├── package.json
└── tsconfig.json                    # TypeScript configuration
```

## Entity Relationships

### User
- Base user entity with authentication details
- Contains common user information
- One-to-one relationship with either Consultant or Client

### Consultant
- Professional profile for counselors
- Includes specialties, bio, education, and verification status
- Has many Sessions and Reviews
- Has many Availability slots for scheduling

### Client
- Profile for those seeking counseling
- Has many Sessions
- Can create Reviews

### Session
- Represents a counseling session
- Contains date, status, and notes
- Links Consultant and Client
- Can have a Review

### Review
- Rating and feedback for a Consultant
- Created by a Client
- Associated with a specific Session

### Availability
- Time slots when a Consultant is available
- Belongs to a specific Consultant
- Used for scheduling appointments
- Prevents overlapping appointments

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd family-counseling-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRATION=3600s
   DATABASE_PATH=database/database.sqlite
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   ```

5. **Access the Swagger documentation**
   Open your browser and navigate to:
   ```
   http://localhost:3000/api
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get a specific user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user (admin only)

### Consultants
- `GET /consultants` - Get all consultants with optional filtering
- `GET /consultants/:id` - Get a specific consultant
- `POST /consultants` - Create a consultant profile
- `PATCH /consultants/:id` - Update a consultant profile
- `PATCH /consultants/:id/verify` - Verify a consultant (admin only)
- `DELETE /consultants/:id` - Delete a consultant (admin only)

### Consultant Availability
- `GET /consultants/:id/availabilities` - Get all availabilities for a consultant
- `GET /consultants/availabilities/:id` - Get a specific availability
- `POST /consultants/availabilities` - Create a new availability slot
- `PATCH /consultants/availabilities/:id` - Update an availability slot
- `DELETE /consultants/availabilities/:id` - Delete an availability slot
- `GET /consultants/:id/available-slots?date=YYYY-MM-DD` - Get available time slots for a specific date

### Clients
- `GET /clients` - Get all clients (admin only)
- `GET /clients/:id` - Get a specific client
- `POST /clients` - Create a client profile
- `PATCH /clients/:id` - Update a client profile
- `DELETE /clients/:id` - Delete a client (admin only)

### Sessions
- `GET /sessions` - Get all sessions (admin only)
- `GET /sessions/consultant/:consultantId` - Get sessions by consultant
- `GET /sessions/client/:clientId` - Get sessions by client
- `GET /sessions/:id` - Get a specific session
- `POST /sessions` - Create a new session
- `PATCH /sessions/:id` - Update a session
- `PATCH /sessions/:id/status` - Update session status
- `DELETE /sessions/:id` - Delete a session (admin only)

### Reviews
- `GET /reviews` - Get all reviews
- `GET /reviews/consultant/:consultantId` - Get reviews by consultant
- `GET /reviews/:id` - Get a specific review
- `POST /reviews` - Create a new review
- `DELETE /reviews/:id` - Delete a review (admin only)

### Messaging
- `POST /messaging/send` - Send a message via a messenger (telegram or whatsapp)

### Admin
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/consultants/pending` - Get list of pending consultants
- `PATCH /admin/consultants/:id/verify` - Verify or reject a consultant

## Authentication

The API uses JWT (JSON Web Token) for authentication:

1. **Registration**: Create a new user with `POST /auth/register`
2. **Login**: Authenticate and receive a JWT token with `POST /auth/login`
3. **Authorization**: Include the token in the `Authorization` header as `Bearer <token>` for protected routes

## Features

### User Management
- Registration and authentication
- Role-based access control (Admin, Consultant, Client)
- Profile management

### Consultant Profiles
- Detailed profiles with specialties and credentials
- Verification system for quality control
- Rating and review system

### Availability Management
- Consultants can set their available time slots
- Time slots are checked for overlaps
- Clients can view available slots for a specific date
- Integration with session scheduling

### Session Management
- Session scheduling based on consultant availability
- Status tracking (pending, confirmed, completed, canceled)
- Notes and documentation

### Messaging Integration
- Integration with popular messaging platforms (Telegram, WhatsApp)
- Session-based communication

### Review System
- Rating system (1-5 stars)
- Text reviews
- Average rating calculation

### Admin Dashboard
- Platform statistics
- Consultant verification
- User management

## Development

### Running in Development Mode
```bash
npm run start:dev
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Running Tests
```bash
npm run test
npm run test:e2e
```

### Database Migrations
```bash
npm run migration:generate -- MigrationName
npm run migration:run
```

This README covers the essential information about the Family Counseling Platform API. For more detailed information, refer to the source code and the Swagger documentation available at `/api` when the server is running.