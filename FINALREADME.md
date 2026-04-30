# FINALREADME.md - EventFlow Project Technical Blueprint

## 1. Architecture Overview

EventFlow is a full-stack web application built with a client-server architecture. The frontend is a React-based single-page application (SPA) built with Vite, deployed on Vercel. The backend is a Node.js/Express API server deployed on Railway, using PostgreSQL as the database managed by Prisma ORM.

**Client-Server Relationship:**
- Frontend (React/Vite) makes HTTP requests to the backend API endpoints.
- Authentication uses JWT tokens stored in localStorage on the client.
- CORS is configured to allow requests from Vercel's production domains.
- Real-time features are not implemented; all interactions are request-response based.

**Hosting Platforms:**
- **Vercel**: Hosts both frontend applications (event-ticket user app and admin-panel). Uses build commands like `vite build` and serves static assets with SPA routing via rewrites.
- **Railway**: Hosts the backend Node.js server with PostgreSQL database. Environment variables are set for DATABASE_URL, JWT_SECRET, and PORT.

## 2. Backend Deep-Dive (ticketwave-backend)

### Dependencies
- **@prisma/client (^5.22.0)**: ORM client for database queries and migrations.
- **bcryptjs (^3.0.3)**: Password hashing for secure storage during user registration.
- **cors (^2.8.6)**: Enables cross-origin requests from frontend domains.
- **dotenv (^17.4.2)**: Loads environment variables from .env file.
- **express (^5.2.1)**: Web framework for building REST API endpoints.
- **jsonwebtoken (^9.0.3)**: Generates and verifies JWT tokens for authentication.
- **nodemon (^3.1.14)**: Development tool for auto-restarting server on file changes.
- **pg (^8.20.0)**: PostgreSQL driver for database connections.
- **prisma (^5.22.0)**: ORM tool for schema definition, migrations, and database management.
- **uuid (^14.0.0)**: Generates unique identifiers for user/event/ticket IDs.

### Database Schema
Full schema.prisma content:

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  tickets   Ticket[]
}

model Event {
  id          String   @id @default(uuid())
  title       String
  description String
  date        DateTime
  location    String
  capacity    Int
  createdAt   DateTime @default(now())
  tickets     Ticket[]
}

model Ticket {
  id         String   @id @default(uuid())
  ticketCode String   @unique @default(uuid())
  status     String   @default("valid")
  userId     String
  eventId    String
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
  event      Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

**Relationships Explanation:**
- **User → Tickets**: One-to-many (a user can have multiple tickets).
- **Event → Tickets**: One-to-many (an event can have multiple tickets).
- **Ticket → User & Event**: Many-to-one (each ticket belongs to one user and one event).
- **onDelete: Cascade on Ticket.eventId**: When an event is deleted, all associated tickets are automatically deleted by the database.

### API Documentation

#### Auth Routes (/auth)
- **POST /register**
  - Controller: Validates fullName, email, password; checks for existing email; hashes password with bcrypt; creates user; signs JWT; returns token and user data.
  - Request Body: { fullName: string, email: string, password: string }
  - Middleware: None
- **POST /login**
  - Controller: Finds user by email; compares password with bcrypt; signs JWT; returns token and user data.
  - Request Body: { email: string, password: string }
  - Middleware: None
- **POST /register-admin**
  - Controller: Requires adminSecret === 'eventflow-admin-2026'; creates admin user.
  - Request Body: { fullName: string, email: string, password: string, adminSecret: string }
  - Middleware: None

#### Events Routes (/events)
- **GET /**
  - Controller: Fetches all events ordered by date ascending.
  - Params: None
  - Middleware: None
- **GET /:id**
  - Controller: Fetches single event by ID.
  - Params: id (string)
  - Middleware: None
- **POST /:id/register**
  - Controller: Checks user exists; verifies no existing ticket; checks event capacity; creates ticket; includes user and event data.
  - Params: id (string)
  - Request Body: {}
  - Middleware: authMiddleware

#### Tickets Routes (/tickets)
- **GET /my**
  - Controller: Fetches user's tickets with event details.
  - Params: None
  - Middleware: authMiddleware
- **GET /:ticketCode**
  - Controller: Fetches ticket by code with user and event details.
  - Params: ticketCode (string)
  - Middleware: None
- **DELETE /:ticketCode**
  - Controller: Verifies ticket belongs to user; deletes ticket and associated data via cascade.
  - Params: ticketCode (string)
  - Middleware: authMiddleware

#### Admin Routes (/admin)
- **POST /make-first-admin**
  - Controller: Promotes user to admin with secret.
  - Request Body: { email: string, secret: string }
  - Middleware: authMiddleware, adminMiddleware
- **GET /stats**
  - Controller: Counts total events, tickets, users.
  - Params: None
  - Middleware: authMiddleware, adminMiddleware
- **GET /events**
  - Controller: Lists all events.
  - Params: None
  - Middleware: authMiddleware, adminMiddleware
- **POST /events**
  - Controller: Creates new event with provided fields.
  - Request Body: { title, description, date, location, capacity }
  - Middleware: authMiddleware, adminMiddleware
- **PUT /events/:id**
  - Controller: Updates event by ID.
  - Params: id (string)
  - Request Body: { title, description, date, location, capacity }
  - Middleware: authMiddleware, adminMiddleware
- **DELETE /events/:id**
  - Controller: Deletes event and cascades to tickets.
  - Params: id (string)
  - Middleware: authMiddleware, adminMiddleware
- **GET /users**
  - Controller: Lists users with ticket counts.
  - Params: None
  - Middleware: authMiddleware, adminMiddleware
- **PATCH /users/:id/role**
  - Controller: Updates user role to admin/user.
  - Params: id (string)
  - Request Body: { role: string }
  - Middleware: authMiddleware, adminMiddleware
- **GET /recent**
  - Controller: Fetches last 5 tickets with user/event details.
  - Params: None
  - Middleware: authMiddleware, adminMiddleware
- **GET /events/:id/tickets**
  - Controller: Fetches tickets for specific event.
  - Params: id (string)
  - Middleware: authMiddleware, adminMiddleware

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (e.g., postgresql://user:pass@host:port/db)
- **JWT_SECRET**: Secret key for JWT signing (e.g., a long random string)
- **PORT**: Server port (defaults to 5000)

## 3. Frontend Deep-Dive (event-ticket)

### Tech Stack
- **Vite**: Fast build tool and dev server for modern web apps, chosen for its speed and plugin ecosystem.
- **React**: UI library with hooks for component state management.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling and responsive design.
- **TanStack Router**: File-based routing with search params and loaders.
- **Axios**: HTTP client for API requests with interceptors for auth tokens.
- **React QR Code**: Library for generating QR codes from ticket URLs.
- **Sonner**: Toast notifications for user feedback.

### State Management
- **Authentication**: JWT tokens stored in localStorage; AuthContext provides user state, login/logout functions, and isAuthenticated/isAdmin checks.
- **Protected Routes**: useEffect checks isAuthenticated; redirects to login with redirect param.
- **API Interceptors**: Request interceptor adds Authorization header if token exists.

### Component Breakdown
- **routes/index.tsx**: Landing page with hero, features, CTA; redirects authenticated users to /events.
- **routes/login.tsx**: Login form with email/password; Field component with password toggle.
- **routes/register.tsx**: Registration form with name/email/password/confirm; Field component with toggles.
- **routes/events.index.tsx**: Protected events list; redirects if not authenticated.
- **routes/events_.$id.tsx**: Event detail with registration; shows success/error toasts.
- **routes/my-tickets.tsx**: User's tickets list with unregister modal.
- **routes/tickets.$ticketCode.tsx**: Ticket display with QR code and print button.
- **components/TicketCard.tsx**: Displays ticket info with unregister option.
- **components/CancelTicketModal.tsx**: Confirmation modal for ticket cancellation.
- **api/index.ts**: Axios instance with base URL and auth interceptors; API functions for auth, events, tickets.
- **context/AuthContext.tsx**: Manages user state, token persistence, auth functions.

### Key Features Logic
- **Password Toggle**: Field component renders button with Eye/EyeOff icons; onClick toggles showPassword state and input type between "password"/"text".
- **Ticket Generation**: Fetches ticket data via ticketsApi.get(ticketCode); displays user/event info, QR code from react-qr-code using ticket URL.
- **Print Functionality**: window.print() triggers browser print dialog for ticket screenshot.

## 4. Project History & Fixes
- **P2003 Foreign Key Error Fix**: Added user existence check in events.js register route before creating ticket to prevent invalid JWT user IDs.
- **Download Button Removal**: Removed html2canvas-based download for mobile compatibility issues; replaced with print functionality for screenshot workflow.

## 5. Full Deployment Steps
- **Database Migration**: Run `npx prisma generate` to update client; `npx prisma db push` to apply schema to Railway PostgreSQL.
- **Server Start on Railway**: Set environment variables (DATABASE_URL, JWT_SECRET, PORT); Railway auto-starts `node src/index.js` on deployment.
- **Frontend Deployment**: Vercel detects package.json build script; sets VITE_API_URL to Railway backend; deploys static build.