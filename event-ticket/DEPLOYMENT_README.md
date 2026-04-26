# Deployment Guide for Event Ticket Repository

## Backend (ticketwave-backend)

### Tech Stack
- Node.js with Express.js framework
- Prisma ORM with PostgreSQL database
- Authentication: JWT with bcryptjs for password hashing
- CORS enabled for development origins (localhost:8080, 8081, 3000, 3001)
- UUID for ID generation
- No build process required (interpreted runtime)

### Build Commands and Output
- No build command needed
- Runtime command: `node src/index.js` (production) or `nodemon src/index.js` (development)
- Output: No static output folder; serves dynamically

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (currently set to Railway instance)
- `JWT_SECRET`: Secret key for JWT tokens (change for production)
- `PORT`: Server port (defaults to 5000)

### Serverless Compatibility
- Not currently serverless-compatible
- Express.js can be adapted for serverless deployment using adapters (e.g., Vercel Serverless Functions, AWS Lambda with express-serverless)
- Requires code restructuring to export app instead of calling `listen()`

### API Routes
- `/auth`: Authentication endpoints
- `/events`: Event management
- `/tickets`: Ticket operations  
- `/admin`: Administrative functions
- `/`: Health check endpoint

### Database Schema
- Uses Prisma with PostgreSQL
- Models: User, Event, Ticket
- Requires `npx prisma migrate deploy` in production after deployment

### Missing Configurations/Errors
- CORS origins hardcoded to localhost; must update for production domains
- JWT secret is development value; regenerate for production
- No error handling or logging middleware visible
- No rate limiting or security headers

### Hosting Recommendations
1. **Railway** (recommended - matches current DB)
2. **Vercel** (with serverless adapter)
3. **Heroku**
4. **Render**
5. **AWS EC2** (traditional hosting)

### Step-by-Step Deployment Instructions
1. Set up Railway account and connect repository
2. Update `DATABASE_URL` in Railway environment variables
3. Generate new `JWT_SECRET` and set in Railway env vars
4. Update CORS origins in `src/index.js` to production frontend URLs
5. Deploy to Railway
6. Run database migrations: `npx prisma migrate deploy`
7. Note the deployed backend URL for frontend configuration

## Frontend (event-ticket)

### Tech Stack
- React 19 with TypeScript
- TanStack Router and Start (full-stack framework with SSR)
- Vite build tool
- Tailwind CSS for styling
- Radix UI component library
- Axios for HTTP requests
- React Hook Form with Zod validation
- Recharts for data visualization
- Lucide React for icons

### Build Commands and Output
- Build command: `vite build`
- Development: `vite dev`
- Output folder: `dist/`

### Required Environment Variables
- `VITE_API_URL`: Backend API base URL (currently `http://localhost:5000`)

### Frontend-Backend Connections
- Uses Axios to call backend API endpoints
- No CORS issues in development (backend allows localhost origins)
- Production API URL must be configured for deployment

### Missing Configurations/Errors
- API URL hardcoded to localhost; must update for production
- No error boundaries or loading states visible
- No PWA configuration or service workers

### Hosting Recommendations
1. **Vercel** (recommended - excellent TanStack Start support)
2. **Netlify**
3. **Cloudflare Pages**
4. **Railway**
5. **GitHub Pages** (static hosting only, no SSR)

### Step-by-Step Deployment Instructions
1. Update `VITE_API_URL` in `.env` to deployed backend URL
2. Set up Vercel account and connect repository
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable `VITE_API_URL` in Vercel dashboard
5. Deploy to Vercel
6. Update backend CORS origins to include Vercel deployment URL

## Admin Panel (admin-panel)

### Tech Stack
- React 19 with TypeScript
- React Router DOM for routing (SPA)
- Vite build tool
- Tailwind CSS for styling
- Radix UI component library
- Axios for HTTP requests
- React Hook Form with Zod validation
- Recharts for data visualization
- Lucide React for icons

### Build Commands and Output
- Build command: `vite build`
- Development: `vite --port 3000`
- Output folder: `dist/` (default Vite output)

### Required Environment Variables
- `VITE_API_URL`: Backend API base URL (currently `http://localhost:5000`)

### Frontend-Backend Connections
- Uses Axios to call backend API endpoints
- Relies on backend CORS configuration for cross-origin requests
- Production API URL must be configured for deployment

### Missing Configurations/Errors
- API URL hardcoded to localhost; must update for production
- No authentication guards or protected routes visible
- No build optimization or code splitting configured

### Hosting Recommendations
1. **Netlify** (recommended - excellent SPA support)
2. **Vercel**
3. **Cloudflare Pages**
4. **Railway**
5. **GitHub Pages** (static hosting)

### Step-by-Step Deployment Instructions
1. Update `VITE_API_URL` in `.env` to deployed backend URL
2. Set up Netlify account and connect repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable `VITE_API_URL` in Netlify dashboard
5. Deploy to Netlify
6. Update backend CORS origins to include Netlify deployment URL

### Overall Deployment Notes
- Deploy backend first to get production URL
- Update frontend and admin panel environment variables with production backend URL
- Update backend CORS configuration with production frontend URLs
- Run `npx prisma db push` or `npx prisma migrate deploy` after backend deployment
- Consider setting up CI/CD pipelines for automated deployments
- Monitor for CORS issues and API connectivity after deployment
- Ensure database is accessible from deployed backend location