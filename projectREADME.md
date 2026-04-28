# EventFlow — Full Project Scan & Documentation

## 1. Project Overview
EventFlow is a comprehensive web application designed for event ticketing in Nigeria. It allows users to register accounts, browse upcoming events, register for events, generate QR-coded digital tickets, and manage their bookings. Administrators can create, edit, and delete events, view user statistics, manage user roles, and oversee the platform. The application is targeted at Nigerian students, event organizers, and attendees, providing a seamless experience for discovering and booking live events such as concerts, conferences, workshops, and campus activities.

## 2. Live URLs
- **Frontend User App**: https://eventflow-grp26.vercel.app
- **Admin Panel**: https://admin-eventflow-grp26.vercel.app
- **Backend API**: Hosted on Railway (specific URL not publicly listed, but accessible via the frontend apps)

## 3. Folder Structure
```
GES400/
├── admin-panel/
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects
│   ├── src/
│   │   ├── api.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   └── ...
│   │   │   ├── AuthShell.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── Field.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── States.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── routes/
│   │   │   ├── __root.tsx
│   │   │   ├── events.index.tsx
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── my-tickets.tsx
│   │   │   ├── register.tsx
│   │   │   └── ...
│   │   ├── styles.css
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── routeTree.gen.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   └── vercel.json
├── event-ticket/
│   ├── public/
│   │   ├── _redirects
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── (similar to admin-panel)
│   │   │   ├── AuthShell.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── Field.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── States.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── routes/
│   │   │   ├── __root.tsx
│   │   │   ├── events.index.tsx
│   │   │   ├── events_.$id.tsx
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── my-tickets.tsx
│   │   │   ├── register.tsx
│   │   │   ├── tickets.$ticketCode.tsx
│   │   │   └── ...
│   │   ├── styles.css
│   │   ├── main.tsx
│   │   └── routeTree.gen.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   ├── vercel.json
│   └── .env
├── ticketwave-backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │       └── 20240101000000_initial
│   ├── src/
│   │   ├── index.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── admin.js
│   │       ├── auth.js
│   │       ├── events.js
│   │       └── tickets.js
│   ├── package.json
│   └── .env
└── projectREADME.md (this file)
```

## 4. Tech Stack

### Frontend (event-ticket & admin-panel)
- **React**: ^19.2.0
- **TanStack React Router**: ^1.168.0 (event-ticket), ^1.167.10 (admin-panel)
- **TanStack Router Plugin**: ^1.167.10
- **Vite**: ^7.3.1
- **Tailwind CSS**: ^4.2.1
- **@tailwindcss/postcss**: ^4.0.0-alpha.32
- **Axios**: ^1.15.2
- **Radix UI Components**: Various versions (^1.x)
- **Lucide React**: ^0.575.0
- **Date-fns**: ^4.1.0
- **React Hook Form**: ^7.71.2
- **Zod**: ^3.24.2
- **Sonner**: ^2.0.7
- **Class Variance Authority**: ^0.7.1
- **Tailwind Merge**: ^3.5.0
- **Vite TSConfig Paths**: ^6.0.2
- **TypeScript**: ^5.8.3
- **ESLint**: ^9.32.0
- **Prettier**: ^3.7.3

### Backend
- **Node.js**: Runtime (requires >=22.12.0 for TanStack packages, but deployed on v20+)
- **Express.js**: ^5.2.1
- **Prisma**: ^5.22.0
- **@prisma/client**: ^5.22.0
- **PostgreSQL**: Database (via Railway)
- **bcryptjs**: ^3.0.3
- **jsonwebtoken**: ^9.0.3
- **pg**: ^8.20.0
- **CORS**: ^2.8.6
- **dotenv**: ^17.4.2
- **uuid**: ^14.0.0
- **nodemon**: ^3.1.14

### Database
- **PostgreSQL**: Hosted on Railway

### Deployment/Hosting
- **Vercel**: Frontend apps (event-ticket, admin-panel)
- **Railway**: Backend API
- **Vite**: Build tool
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 5. Backend — Full Detail
- **Framework and Runtime**: Node.js with Express.js
- **Database ORM**: Prisma with PostgreSQL

### API Routes
All routes are prefixed with their respective base paths in index.js.

#### Auth Routes (/auth)
- **POST /register**: Public - Registers a new user. Body: {fullName, email, password}. Returns JWT token and user data.
- **POST /login**: Public - Logs in a user. Body: {email, password}. Returns JWT token and user data.
- **POST /register-admin**: Public (protected by secret) - Creates an admin user. Body: {fullName, email, password, adminSecret}. Requires adminSecret === 'eventflow-admin-2026'.

#### Events Routes (/events)
- **GET /**: Public - Lists all events ordered by date ascending. Returns array of events.
- **GET /:id**: Public - Gets a specific event by ID. Returns event object.
- **POST /:id/register**: Protected (auth required) - Registers user for an event. Creates a ticket. Checks for existing registration, capacity limits.

#### Tickets Routes (/tickets)
- **GET /my**: Protected - Gets user's tickets with event details. Returns array of tickets.
- **GET /:ticketCode**: Public - Gets ticket by code with user and event details. Returns ticket object.
- **GET /recent**: Protected - Gets 5 most recent tickets with user and event info. Returns formatted array.

#### Admin Routes (/admin)
All admin routes require authentication and admin role.
- **POST /make-first-admin**: Public (protected by secret) - Promotes a user to admin. Body: {email, secret}. Requires secret === 'eventflow2026'.
- **GET /stats**: Admin only - Gets platform stats: totalEvents, totalTickets, totalUsers.
- **POST /events**: Admin only - Creates a new event. Body: {title, description, date, location, capacity}.
- **PUT /events/:id**: Admin only - Updates an event. Body: same as create.
- **DELETE /events/:id**: Admin only - Deletes an event.
- **GET /users**: Admin only - Lists all users with ticket counts. Returns formatted user array.
- **PATCH /users/:id/role**: Admin only - Changes user role. Body: {role}. Role must be 'admin' or 'user'.

### Database Schema
#### User Model
- **id**: String (UUID, primary key, default uuid())
- **name**: String
- **email**: String (unique)
- **password**: String
- **role**: String (default "user")
- **createdAt**: DateTime (default now())
- **tickets**: Relation to Ticket[]

#### Event Model
- **id**: String (UUID, primary key, default uuid())
- **title**: String
- **description**: String
- **date**: DateTime
- **location**: String
- **capacity**: Int
- **createdAt**: DateTime (default now())
- **tickets**: Relation to Ticket[]

#### Ticket Model
- **id**: String (UUID, primary key, default uuid())
- **ticketCode**: String (unique, default uuid())
- **status**: String (default "valid")
- **userId**: String (foreign key to User)
- **eventId**: String (foreign key to Event)
- **createdAt**: DateTime (default now())
- **user**: Relation to User
- **event**: Relation to Event

### Auth Mechanism
- **JWT Tokens**: Issued on login/register, expires in 7 days.
- **Token Verification**: Middleware checks Authorization header for Bearer token, verifies with JWT_SECRET.
- **Admin Check**: Additional middleware checks if decoded token has role === 'admin'.
- **Password Hashing**: bcryptjs with salt rounds 10.

### Middleware Used
- **CORS**: Allows origins from localhost and production URLs.
- **authMiddleware**: Verifies JWT token, attaches decoded user to req.user.
- **adminMiddleware**: Checks req.user.role === 'admin'.

### Environment Variables Required
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Secret key for JWT signing
- **PORT**: Server port (default 5000)

### How the Server is Started
- Command: `node src/index.js`
- Development: `nodemon src/index.js`
- Server listens on PORT, uses CORS, JSON middleware, routes mounted at /auth, /events, /tickets, /admin.

## 6. Frontend (User App) — Full Detail
- **Framework and Build Tool**: React with Vite
- **Routing**: TanStack React Router (file-based routing)

### Pages/Routes
- **/**: Landing page with hero, how-it-works, features, CTA. Redirects logged-in users to /events.
- **/login**: Login form. Validates search param 'redirect' for post-login navigation.
- **/register**: Registration form.
- **/events**: Lists upcoming events. Protected - redirects to login if not authenticated.
- **/events/:id**: Event detail page. Shows event info and registration button.
- **/my-tickets**: User's tickets list. Protected.
- **/tickets/:ticketCode**: Public ticket view with QR code.

### Components
- **AuthShell**: Layout for login/register forms.
- **Field**: Reusable input component with label.
- **Navbar**: Navigation bar with links, user menu.
- **EventCard**: Displays event info with register button.
- **TicketCard**: Displays ticket with QR code.
- **States**: EmptyState, ErrorState, Spinner for loading/error states.
- **UI Components**: Button, Card, Input, Label, Select, Table, etc. (shadcn/ui based)

### Auth State Management
- **AuthContext**: React Context with user state, token, loading, isAuthenticated, isAdmin.
- **Persistence**: Token and user stored in localStorage.
- **Login/Register**: Calls API, persists token/user, updates context.
- **Logout**: Clears localStorage, resets context.

### API Calls
- **Axios Instance**: Configured in src/api/client.ts with baseURL from import.meta.env.VITE_API_URL.
- **Interceptors**: Request interceptor adds Authorization header if token exists.
- **Error Handling**: Catches 401s, etc.

### Context Providers
- **AuthProvider**: Wraps app, provides auth state.

### Environment Variables Required
- **VITE_API_URL**: Backend API base URL

## 7. Admin Panel — Full Detail
- **Framework and Build Tool**: React with Vite (similar to user app)
- **Routing**: TanStack React Router

### Admin-Specific Pages
- **/**: Admin dashboard with stats (total events, tickets, users).
- **/events**: Manage events - list, create, edit, delete.
- **/users**: Manage users - list all users, change roles.

### Admin Functionality
- **Role Check**: AuthContext.isAdmin used to protect routes/components.
- **API Calls**: Uses same axios instance, but admin endpoints require admin token.

### Components
Similar to user app, plus admin-specific forms for event creation/editing, user role management.

### Auth State Management
Same as user app, but additional admin checks.

### Environment Variables
- **VITE_API_URL**: Same as user app.

## 8. Key Features — Functional Description
- **User Registration and Login**: Users create accounts with name, email, password. Login with email/password. JWT tokens issued.
- **Event Browsing and Filtering**: Public list of events, ordered by date. No filtering implemented yet.
- **Event Registration/Ticket Generation**: Authenticated users register for events, generating unique QR-coded tickets.
- **QR Code Generation**: Tickets display QR codes using react-qr-code library.
- **My Tickets Page**: Users view their registered events with ticket details.
- **Admin Dashboard Stats**: Admins see total counts of events, tickets, users.
- **Admin Event Management**: Create, edit, delete events with title, description, date, location, capacity.
- **Admin User Management**: View all users with registration dates and ticket counts, change user roles to admin/user.
- **Role-Based Access Control**: Admin routes protected by role check.

## 9. Database Models
### User
- **id**: String, UUID, primary key
- **name**: String
- **email**: String, unique
- **password**: String (hashed)
- **role**: String, default "user"
- **createdAt**: DateTime, default now()
- **tickets**: Has many Ticket

### Event
- **id**: String, UUID, primary key
- **title**: String
- **description**: String
- **date**: DateTime
- **location**: String
- **capacity**: Int
- **createdAt**: DateTime, default now()
- **tickets**: Has many Ticket

### Ticket
- **id**: String, UUID, primary key
- **ticketCode**: String, UUID, unique
- **status**: String, default "valid"
- **userId**: String, foreign key to User.id
- **eventId**: String, foreign key to Event.id
- **createdAt**: DateTime, default now()
- **user**: Belongs to User
- **event**: Belongs to Event

## 10. Authentication & Authorization Flow
1. User registers via POST /auth/register, providing name, email, password.
2. Password hashed with bcrypt, user created in DB, JWT signed with user data.
3. Token and user data returned to frontend, stored in localStorage.
4. On subsequent requests, token sent in Authorization header.
5. authMiddleware verifies token, attaches user to req.
6. adminMiddleware checks role === 'admin' for admin routes.
7. Frontend AuthContext loads token/user from localStorage on mount, sets state.
8. Protected routes use useEffect to check isAuthenticated, redirect to login if not.
9. Logout clears localStorage and context.

## 11. Deployment Setup
- **Backend Hosting**: Railway - Environment variables set in Railway dashboard: DATABASE_URL, JWT_SECRET, PORT.
- **Frontend Hosting**: Vercel - Build command: vite build, Output Directory: dist (admin-panel) / dist/client (event-ticket), Root Directory: respective folders.
- **Production Environment Variables**: VITE_API_URL points to Railway backend URL.
- **Build Commands**: Standard Vite build for frontends, Prisma generate/migrate for backend.
- **Configs**: vercel.json for SPA routing, postcss.config.cjs and tailwind.config.cjs for CSS.

## 12. System Testing Summary
- User registration, login, logout flows work.
- Event browsing, registration, ticket generation with QR codes verified.
- My Tickets page displays user's tickets correctly.
- Admin dashboard shows accurate stats.
- Admin can create, edit, delete events.
- Admin can view users and change roles.
- Public ticket viewing by code works.
- CORS allows production frontends.
- JWT auth protects routes correctly.

## 13. Challenges Encountered
- Infinite re-render loops due to useNavigate in useEffect dependencies - fixed by removing navigate from deps.
- DOM nesting errors from <html> tags in RouterProvider - fixed by removing shellComponent in __root.tsx.
- PostCSS module resolution issues - fixed by using .cjs extensions.
- Tailwind v4 compatibility - added @tailwindcss/postcss.
- Node.js polyfills for AsyncLocalStorage - added vite-plugin-node-polyfills and ssr config.
- Path alias resolution - added resolve.alias in vite.config.ts.

## 14. Raw package.json Contents

### admin-panel/package.json
```json
{
  "name": "tanstack_start_ts",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview --port 3000",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.83.0",
    "axios": "^1.15.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "react-resizable-panels": "^4.6.5",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4",
    "vaul": "^1.1.2",
    "vite-tsconfig-paths": "^6.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "prettier": "^3.7.3",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.56.1",
    "vite": "^7.3.1"
  }
}
```

### event-ticket/package.json
```json
{
  "name": "tanstack_start_ts",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@cloudflare/vite-plugin": "^1.25.5",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.83.0",
    "@tanstack/react-router": "^1.168.0",
    "@tanstack/react-start": "^1.167.14",
    "@tanstack/router-plugin": "^1.167.10",
    "axios": "^1.15.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "react-qr-code": "^2.0.18",
    "react-resizable-panels": "^4.6.5",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4",
    "vaul": "^1.1.2",
    "vite-tsconfig-paths": "^6.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@lovable.dev/vite-tanstack-config": "^1.4.0",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "nodemon": "^3.1.14",
    "prettier": "^3.7.3",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.56.1",
    "vite": "^7.3.1"
  }
}
```

### ticketwave-backend/package.json
```json
{
  "name": "ticketwave-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "nodemon": "^3.1.14",
    "pg": "^8.20.0",
    "prisma": "^5.22.0",
    "uuid": "^14.0.0"
  }
}
```