# Buzdealz - Deal Management & Wishlist Platform

## Overview

A full-stack deal aggregation and wishlist management application built with React, TypeScript, Express.js, and PostgreSQL. The platform enables users to browse deals, manage wishlists, and receive price alerts based on their subscription status.

## Technology Stack

**Frontend:**

- React 18.2 with TypeScript
- Vite 5.0 (Build Tool)
- Tailwind CSS 3.4
- TanStack React Query 5.17
- Wouter 3.0 (Routing)
- Axios 1.6

**Backend:**

- Node.js with Express 4.18
- TypeScript 5.3
- Drizzle ORM 0.29
- PostgreSQL (Supabase)
- JWT Authentication
- Zod Validation

## Project Structure

```
intership-task/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-based pages
│   │   ├── contexts/          # React Context (Auth)
│   │   ├── hooks/             # Custom hooks (useWishlist)
│   │   ├── lib/               # Axios configuration
│   │   └── types/             # TypeScript definitions
│   └── package.json
│
├── server/                     # Backend Express application
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/   # Business logic
│   │   │   ├── routes/        # API endpoints
│   │   │   ├── middleware/    # Auth & validation
│   │   │   └── validators/    # Zod schemas
│   │   ├── db/
│   │   │   ├── schema/        # Database tables
│   │   │   ├── migrations/    # SQL migrations
│   │   │   └── seed.ts        # Test data
│   │   └── server.ts
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher (or Supabase account)

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd intership-task
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Connection
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secret (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET=your-secret-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important:** For Supabase connections, URL-encode special characters in passwords (e.g., `#` becomes `%23`).

#### Run Database Migrations

```bash
npm run db:migrate
```

#### Seed Test Data (Optional but Recommended)

```bash
npm run db:seed
```

This creates:

- **3 test users:**
  - `user@example.com` / `password123` (Regular User)
  - `subscriber@example.com` / `password123` (Subscriber)
  - `demo@buzdealz.com` / `password123` (Demo Account)
- **10 sample deals** (8 active, 1 expired, 1 disabled)

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../client
npm install
```

No additional configuration required. The frontend is pre-configured to connect to the backend API.

### 4. Start Application

#### Start Backend Server (Terminal 1)

```bash
cd server
npm run dev
```

Backend runs at: **http://localhost:3000**

#### Start Frontend Server (Terminal 2)

```bash
cd client
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Testing Instructions

### Manual Testing Procedure

#### 1. Authentication Testing

**Register New User:**

1. Navigate to http://localhost:5173/signup
2. Enter email, name, and password (min 6 characters)
3. Click "Sign Up"
4. Verify redirect to homepage with authenticated state

**Login with Test User:**

1. Navigate to http://localhost:5173/login
2. Enter credentials: `user@example.com` / `password123`
3. Click "Login"
4. Verify profile dropdown appears in header

**Logout:**

1. Click profile icon in header
2. Click red "Logout" button
3. Verify redirect to homepage as guest

#### 2. Deal Browsing Testing

**Browse Deals:**

1. Navigate to http://localhost:5173/
2. Verify deals display in responsive grid
3. Check each deal card shows:
   - Title and description
   - Current and original price
   - Discount badge (if applicable)
   - Category badge
   - Merchant name
   - Wishlist heart icon

**Search Functionality:**

1. Enter keyword in search bar (e.g., "laptop")
2. Verify deals filter in real-time
3. Test clearing search to show all deals

**Category Filter:**

1. Select category from dropdown (e.g., "Electronics")
2. Verify only matching deals display
3. Select "All Categories" to reset filter

**Active Only Toggle:**

1. Uncheck "Active Only" checkbox
2. Verify expired deals appear with gray overlay
3. Re-check to hide expired deals

#### 3. Deal Details Testing

**View Deal Details:**

1. Click "View Details" button on any deal card
2. Verify navigation to `/deals/:id` route
3. Confirm page displays:
   - Large product image
   - Complete description
   - Pricing with discount calculation
   - Category and merchant information
   - Expiry date (if applicable)
   - Wishlist button
   - "Visit Store" external link

**Test Navigation:**

1. Click "Back to Deals" button
2. Verify return to homepage

#### 4. Wishlist Testing

**Add to Wishlist (Guest User):**

1. Logout if authenticated
2. Click heart icon on any deal
3. Verify alert: "Please login to add items to wishlist"
4. Verify redirect to login page

**Add to Wishlist (Authenticated User):**

1. Login as `user@example.com`
2. Click empty heart icon on 3-4 different deals
3. Verify heart icon fills with red color
4. Check wishlist count badge in header updates

**View Wishlist:**

1. Click "Wishlist" in navigation
2. Verify all saved deals display
3. Check sections:
   - Active Deals (main section)
   - Expired Deals (bottom section if any)
4. Verify "Date Added" shows for each item

**Remove from Wishlist:**

1. On wishlist page, click trash icon
2. Confirm deletion in popup
3. Verify deal removed from list
4. Check wishlist count decreases in header

#### 5. Price Alert Testing (Subscriber Feature)

**Test as Non-Subscriber:**

1. Login as `user@example.com`
2. Navigate to wishlist page
3. Click bell icon on any wishlisted deal
4. Verify error message: "Only subscribers can enable price alerts"
5. Verify alert stays disabled

**Test as Subscriber:**

1. Logout and login as `subscriber@example.com`
2. Navigate to wishlist page
3. Verify "Premium" badge shows in profile dropdown
4. Click bell icon on wishlisted deal
5. Verify bell icon changes to filled/active state
6. Click again to toggle off
7. Verify alert disabled

#### 6. Responsive Design Testing

**Mobile View (< 768px):**

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Verify:
   - Single column layout
   - Hamburger menu in header
   - Touch-friendly buttons
   - No horizontal scrolling

**Tablet View (768px - 1024px):**

1. Set viewport to "iPad" or 768px width
2. Verify:
   - Two-column deal grid
   - Adjusted navigation layout
   - Proper spacing

**Desktop View (> 1024px):**

1. Set viewport to desktop (1440px)
2. Verify:
   - Three-column deal grid
   - Full navigation visible
   - Maximum content width constraint

#### 7. Error Handling Testing

**Test Network Errors:**

1. Stop backend server (Ctrl+C in server terminal)
2. Refresh frontend page
3. Verify error messages display
4. Click "Retry" buttons
5. Restart server: `npm run dev`
6. Verify page loads successfully

**Test Invalid Login:**

1. Navigate to login page
2. Enter `user@example.com` / `wrongpassword`
3. Verify error message: "Invalid email or password"
4. Verify form remains filled (email not cleared)

**Test Expired Deals:**

1. Find deal with expired badge
2. Verify "Expired" or "Unavailable" overlay
3. Click "View Details"
4. Verify action buttons are disabled
5. Check wishlist can still be managed

### API Testing with cURL

#### Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "password123"
  }'
```

**Expected Response:** Status 201 with token and user object

#### Test User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Expected Response:** Status 200 with token and user object

#### Test Get Deals

```bash
curl http://localhost:3000/api/deals
```

**Expected Response:** Status 200 with array of deals

#### Test Get Wishlist (Requires Authentication)

```bash
curl http://localhost:3000/api/wishlist \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:** Status 200 with wishlist array

#### Test Add to Wishlist (Requires Authentication)

```bash
curl -X POST http://localhost:3000/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "dealId": "deal-uuid-here",
    "alertEnabled": false
  }'
```

**Expected Response:** Status 201 with wishlist item

### Performance Testing

**Page Load Testing:**

1. Open browser DevTools > Network tab
2. Clear cache (Ctrl+Shift+Delete)
3. Navigate to homepage
4. Verify:
   - Initial load < 2 seconds
   - API response times < 500ms
   - No failed requests

**Search Debouncing:**

1. Open Network tab
2. Type quickly in search bar
3. Verify API calls are debounced (not every keystroke)
4. Confirm delay is ~300ms after stopping typing

---

## Features

### 1. User Authentication

- Secure JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- 7-day token expiration
- Protected routes with middleware

### 2. Deal Management

- Browse all available deals
- Search by title/description
- Filter by category
- Toggle expired deals visibility
- View detailed deal information
- Direct links to merchant stores

### 3. Wishlist System

- Add/remove deals from wishlist
- Real-time count badge
- Separate expired deals section
- Persistent across sessions
- Guest user handling with prompts

### 4. Price Alerts (Subscriber Feature)

- Enable/disable per deal
- Subscriber-only validation
- Visual bell icon indicators
- Future email notification support

### 5. Responsive Design

- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interface
- Optimized for all devices

### 6. User Experience

- Loading states with spinners
- Error handling with retry options
- Empty state messages
- Optimistic UI updates
- Form validation feedback

---

## API Endpoints

### Authentication

```
POST   /api/auth/register       Create new user account
POST   /api/auth/login          Authenticate and return JWT
GET    /api/auth/profile        Get current user (protected)
```

### Deals

```
GET    /api/deals               List all deals
       Query: ?search=keyword&category=Electronics&activeOnly=true&limit=50
GET    /api/deals/:id           Get single deal by ID
POST   /api/deals               Create deal (protected, admin)
```

### Wishlist

```
GET    /api/wishlist            Get user wishlist (protected)
POST   /api/wishlist            Add to wishlist (protected)
PATCH  /api/wishlist/:dealId    Update alert settings (protected)
DELETE /api/wishlist/:dealId    Remove from wishlist (protected)
GET    /api/wishlist/count      Get wishlist count (protected)
```

### Health Check

```
GET    /health                  Server status
```

---

## Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `password` (VARCHAR, NOT NULL) - bcrypt hashed
- `isSubscriber` (BOOLEAN, DEFAULT false)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Deals Table

- `id` (UUID, Primary Key)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `price` (NUMERIC(10,2), NOT NULL)
- `originalPrice` (NUMERIC(10,2), NOT NULL)
- `imageUrl` (VARCHAR)
- `category` (VARCHAR)
- `merchant` (VARCHAR)
- `link` (VARCHAR)
- `isActive` (BOOLEAN, DEFAULT true)
- `expiresAt` (TIMESTAMP)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Wishlist Table

- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `dealId` (UUID, Foreign Key)
- `alertEnabled` (BOOLEAN, DEFAULT false)
- `createdAt` (TIMESTAMP)
- **Unique Constraint:** (userId, dealId)
- **Indexes:** userId, dealId

---

## Troubleshooting

### Backend Won't Start

**Solution:**

```bash
cd server
npm install
npm run db:migrate
npm run dev
```

Check `.env` file configuration and verify DATABASE_URL is correct.

### Frontend Won't Start

**Solution:**

```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database Connection Error

**Causes:**

- Incorrect DATABASE_URL format
- Password not URL-encoded
- Supabase project inactive

**Solution:**

1. Verify `.env` DATABASE_URL format
2. Encode special characters (# → %23)
3. Test connection: `npm run db:migrate`

### No Deals Showing

**Solution:**

```bash
cd server
npm run db:seed
```

### Port Already in Use

**Backend (Port 3000):**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <process-id> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Frontend (Port 5173):**
Change port in `client/vite.config.ts` or kill process using port.

### Authentication Errors

**"Invalid token" or "Unauthorized":**

1. Clear browser localStorage: `localStorage.clear()`
2. Logout and login again
3. Verify JWT_SECRET in `.env` hasn't changed

### Wishlist Not Updating

**Solution:**

1. Check browser console for errors
2. Verify backend server is running
3. Check Network tab for API responses
4. Clear React Query cache (hard refresh)

---

## Security Features

- **Password Security:** bcrypt hashing with 10 salt rounds
- **Authentication:** JWT tokens with 7-day expiration
- **Authorization:** Middleware-protected routes
- **SQL Injection Prevention:** Drizzle ORM parameterized queries
- **XSS Protection:** React auto-escaping + Helmet headers
- **CORS:** Configured for specific origins
- **Input Validation:** Zod schemas on all endpoints
- **HTTPS:** Recommended for production (SSL configuration included)

---

## Available Commands

### Server Commands

```bash
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm start            # Run production build
npm run db:migrate   # Apply database migrations
npm run db:seed      # Populate test data
npm run db:studio    # Open Drizzle Studio (visual DB browser)
```

### Client Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Environment Variables

### Server (.env)

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### Client

No environment variables required. API base URL is pre-configured.

---

## License

Proprietary and confidential.

---

## Support

For questions or issues, contact the development team.
