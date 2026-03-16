# Blood Donation Website - Complete Project Documentation

Welcome to the Blood Donation Website! This is a full-stack web application built with modern technologies. This README will help you understand how the project works from architecture to implementation details.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technologies Used](#2-technologies-used)
3. [Project Architecture](#3-project-architecture)
4. [Frontend Explanation](#4-frontend-explanation)
5. [Backend Explanation](#5-backend-explanation)
6. [Database Structure](#6-database-structure)
7. [API Endpoints](#7-api-endpoints)
8. [How the System Works](#8-how-the-system-works)
9. [How to Run the Project](#9-how-to-run-the-project)
10. [Learning Notes](#10-learning-notes)

---

## 1. Project Overview

This is a **Blood Donation Management System** that connects blood donors with people who need blood. The platform allows:

- **Donors** to register, manage their profile, and track their donation history
- **Clients (Blood Seekers)** to search for available donors by blood type and location
- **Admins** to manage users, roles, permissions, and view analytics

### Main Features:
- User Registration and Authentication
- Donor Profile Management
- Blood Donor Search
- Donation History Tracking
- Role-Based Access Control (RBAC)
- Permission System
- Admin Dashboard with Analytics
- Statistics and Leaderboard

---

## 2. Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Chakra UI** | Component Library & Styling |
| **React Router** | Client-side Routing |
| **Axios** | HTTP Client for API calls |
| **React Icons** | Icon Library |
| **Recharts** | Data Visualization/Charts |
| **Framer Motion** | Animations |

### Backend
| Technology | Purpose |
|------------|---------|
| **NestJS** | Node.js Backend Framework |
| **Prisma** | ORM (Object-Relational Mapping) |
| **SQLite** | Database |
| **JWT** | Authentication Tokens |
| **Bcrypt** | Password Hashing |
| **Swagger/OpenAPI** | API Documentation |

### Development Tools
| Tool | Purpose |
|------|---------|
| **TypeScript** | Type Safety |
| **ESLint** | Code Linting |
| **React Scripts** | React Development |

---

## 3. Project Architecture

### Overall Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Browser       │ ───► │   Backend API   │ ───► │    Database     │
│   (React)       │      │   (NestJS)     │      │   (SQLite)      │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Frontend-Backend Communication

1. **Frontend** makes HTTP requests using Axios
2. **Backend** receives requests, validates data, processes business logic
3. **Database** stores and retrieves data via Prisma ORM
4. **Response** is sent back to frontend in JSON format

### Folder Structure

```
blood-donation-project/
├── frontend/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Navbar.js       # Top Navigation Bar
│   │   │   ├── Sidebar.js      # Side Navigation Menu
│   │   │   ├── ProtectedRoute.js # Route Protection
│   │   │   └── DataTable.js    # Reusable Table Component
│   │   ├── pages/              # Page Components
│   │   │   ├── Dashboard.js    # Dashboard Page
│   │   │   ├── Users.js        # User Management (Admin)
│   │   │   ├── Donors.js       # Donor Management (Admin)
│   │   │   ├── Roles.js        # Role Management (Admin)
│   │   │   ├── Profile.js      # User Profile
│   │   │   ├── ClientSearch.js # Search Donors (Client)
│   │   │   ├── Login.js        # Login Page
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js          # API Service (Axios)
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication State
│   │   ├── theme.js            # Chakra UI Theme
│   │   ├── App.js              # Main App Component
│   │   └── index.js            # Entry Point
│   └── package.json
│
├── src/                        # NestJS Backend
│   ├── common/                 # Shared Utilities
│   │   ├── decorators/         # Custom Decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/             # Route Guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── permissions.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── modules/                # Feature Modules
│   │   ├── auth/               # Authentication
│   │   ├── user/               # User Management
│   │   ├── donor/              # Donor Management
│   │   ├── client/             # Client/Blood Seeker
│   │   ├── role/               # Role Management
│   │   ├── permission/         # Permission Management
│   │   ├── donation/           # Donation Records
│   │   ├── statistics/         # Analytics & Stats
│   │   ├── admin/              # Admin Functions
│   │   └── leaderboard/        # Donor Rankings
│   ├── prisma/                 # Database Service
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts          # Root Module
│   └── main.ts                # Entry Point
│
├── prisma/
│   └── schema.prisma          # Database Schema
│
└── package.json               # Root Package.json
```

### Role System

The system has **3 main user roles**:

| Role | Description | Features |
|------|-------------|----------|
| **ADMIN** | System Administrator | Full access to all features, user management, role management, analytics |
| **DONOR** | Blood Donor | Profile management, donation history, donate blood |
| **CLIENT** | Blood Seeker | Search for donors, contact donors |

### Permission System

The system uses a **granular permission system** with these permissions:

```typescript
READ_ALL, WRITE_ALL           // Super admin permissions
READ_USER, WRITE_USER         // User management
READ_DONOR, WRITE_DONOR       // Donor management
READ_CLIENT, WRITE_CLIENT     // Client management
READ_ROLE, WRITE_ROLE         // Role management
READ_PERMISSION, WRITE_PERMISSION
READ_DONATION, WRITE_DONATION
READ_STATISTICS, READ_LEADERBOARD
```

**How it works:**
1. Permissions are assigned to Roles
2. Roles are assigned to Users
3. Guards check if user has required permissions before allowing access

---

## 4. Frontend Explanation

### Framework: React

React is a JavaScript library for building user interfaces. It uses a component-based architecture.

### Key Files and Their Purpose

#### Entry Point
```javascript
// frontend/src/index.js
// The main entry point that renders the React app
```

#### Main App Component
```javascript
// frontend/src/App.js
// Defines all routes using React Router
// Protected routes wrap components that need authentication
```

#### Authentication Context
```javascript
// frontend/src/context/AuthContext.js
// Manages global authentication state
// Provides: user, login, logout, isAuthenticated
```

#### API Service
```javascript
// frontend/src/services/api.js
// Axios instance with interceptors
// Handles: token injection, error handling, redirects
```

### Pages Overview

| Page | Path | Role | Description |
|------|------|------|-------------|
| Login | `/login` | All | User login |
| Register | `/register` | All | User registration |
| Dashboard | `/dashboard` | All | Main dashboard with stats |
| Users | `/users` | Admin | Manage system users |
| Donors | `/donors` | Admin | View all donors |
| Roles | `/roles` | Admin | Manage roles & permissions |
| Statistics | `/statistics` | Admin | View analytics |
| Profile | `/profile` | Donor | Manage donor profile |
| Donation History | `/donation-history` | Donor | View donation records |
| Donate Now | `/donate-now` | Donor | Register new donation |
| Search Donors | `/search-donors` | Client | Search for blood donors |

### State Management

The app uses **React Context API** for state management:
- `AuthContext` - Manages user authentication state
- Local `useState` - Manages component-specific state

### API Calls Pattern

```javascript
// Example: Fetching data
const response = await userService.getUsers(params);
setUsers(response.data);

// Example: Creating data
await userService.createUser(userData);
toast({ title: 'Success', status: 'success' });
```

---

## 5. Backend Explanation

### Framework: NestJS

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

### Module Structure

Each feature is organized into a **module** with:

```
module-name/
├── module-name.module.ts    # Module definition
├── module-name.controller.ts # API endpoints (routes)
├── module-name.service.ts   # Business logic
└── module-name.dto.ts       # Data Transfer Objects
```

### Controllers (`*.controller.ts`)

Controllers handle incoming requests and return responses to the client.

```typescript
// Example Controller
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  @Get()
  @Permissions(PERMISSIONS.READ_USER)
  async findAll() {
    return this.userService.findAll();
  }
}
```

### Services (`*.service.ts`)

Services contain the business logic and interact with the database.

```typescript
// Example Service
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

### Guards

Guards protect routes by checking permissions before allowing access.

1. **JwtAuthGuard** - Verifies JWT token
2. **RolesGuard** - Checks user role
3. **PermissionsGuard** - Checks specific permissions

### Authentication Flow

```
1. User submits login credentials
2. Backend validates and generates JWT token
3. Token is sent to frontend
4. Frontend stores token in localStorage
5. Subsequent requests include token in Authorization header
6. Backend validates token and extracts user info
```

---

## 6. Database Structure

### Database Models (Schema)

#### 1. User Model
```prisma
model User {
  id              Int          @id @default(autoincrement())
  email           String       @unique
  phone           String       @unique
  password        String
  name            String
  bloodGroup      String?
  userType        String       @default("DONOR")  // ADMIN, DONOR, CLIENT
  gender          String?
  lastDonationDate DateTime?
  isActive        Boolean      @default(true)
  isProfileComplete Boolean     @default(false)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  roleId          Int?
  role            Role?        @relation(fields: [roleId], references: [id])
  
  profile         DonorProfile?
  donations       Donation[]
  refreshToken    String?
}
```

#### 2. DonorProfile Model
```prisma
model DonorProfile {
  id              Int       @id @default(autoincrement())
  userId          Int       @unique
  user            User      @relation(fields: [userId], references: [id])
  
  email           String?
  mobile          String?
  availableStatus String   @default("AVAILABLE")
  isActive        Boolean   @default(true)
  
  district        String?
  upazila         String?
  area            String?
  additionalInfo  String?
  
  facebook        String?
  linkedin       String?
  twitter        String?
  website        String?
  
  totalDonations  Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

#### 3. Role Model
```prisma
model Role {
  id          Int         @id @default(autoincrement())
  name        String      @unique
  description String?
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  permissions Permission[] @relation("RolePermissions")
  users       User[]
}
```

#### 4. Permission Model
```prisma
model Permission {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  roles       Role[]    @relation("RolePermissions")
}
```

#### 5. Donation Model
```prisma
model Donation {
  id            Int       @id @default(autoincrement())
  userId        Int
  user          User      @relation(fields: [userId], references: [id])
  donationDate  DateTime  @default(now())
  location      String?
  createdAt    DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### 6. AuditLog Model
```prisma
model AuditLog {
  id        Int       @id @default(autoincrement())
  userId    Int?
  action    String
  entity    String
  entityId  Int?
  details   String?
  ipAddress String?
  userAgent String?
  createdAt DateTime  @default(now())
}
```

### Relationships

```
User ──────► Role (Many-to-One)
User ──────► DonorProfile (One-to-One)
User ──────► Donation (One-to-Many)
Role ──────► Permission (Many-to-Many)
```

---

## 7. API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/profile` | Get current user profile | Auth |
| GET | `/api/v1/users/:id` | Get user by ID | Admin |
| POST | `/api/v1/users` | Create new user | Admin |
| PUT | `/api/v1/users/profile` | Update profile | Auth |
| PUT | `/api/v1/users/:id` | Update user | Admin |
| DELETE | `/api/v1/users/:id` | Disable user | Admin |

### Donor Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/donors/eligible` | Get eligible donors | Admin |
| GET | `/api/v1/donors/profile` | Get donor profile | Donor |
| PUT | `/api/v1/donors/profile` | Update donor profile | Donor |
| GET | `/api/v1/donors/:id/eligibility` | Check eligibility | Donor |

### Client (Blood Seeker) Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/client/search` | Search donors | Client |
| POST | `/api/v1/client/contact/:donorId` | Contact donor | Client |

### Role Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/roles` | Get all roles | Admin |
| GET | `/api/v1/roles/:id` | Get role by ID | Admin |
| POST | `/api/v1/roles` | Create role | Admin |
| PUT | `/api/v1/roles/:id` | Update role | Admin |
| DELETE | `/api/v1/roles/:id` | Delete role | Admin |

### Permission Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/permissions` | Get all permissions | Admin |

### Donation Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/donations/my` | Get my donations | Donor |
| POST | `/api/v1/donations` | Create donation | Donor |
| GET | `/api/v1/donations` | Get all donations | Admin |

### Statistics Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/statistics/public` | Get public stats | Public |
| GET | `/api/v1/statistics/donations-per-month` | Monthly donations | Admin |
| GET | `/api/v1/statistics/new-users-per-month` | New users | Admin |
| GET | `/api/v1/statistics/active-districts` | Active districts | Admin |

---

## 8. How the System Works

### Flow 1: User Registration

```
1. User visits /register page
2. Fills registration form (name, email, phone, password, userType)
3. Submits form
4. Frontend calls POST /api/v1/auth/register
5. Backend validates input
6. Backend hashes password with bcrypt
7. Backend creates user in database
8. Backend returns success response
9. Frontend redirects to login page
```

### Flow 2: User Login

```
1. User visits /login page
2. Enters email and password
3. Submits form
4. Frontend calls POST /api/v1/auth/login
5. Backend validates credentials
6. Backend verifies password with bcrypt
7. Backend generates JWT token
8. Backend returns token + user data
9. Frontend stores token in localStorage
10. Frontend redirects to Dashboard
11. AuthContext updates user state
```

### Flow 3: Donor Profile Update

```
1. Donor logs in and navigates to /profile
2. Frontend fetches profile data via GET /api/v1/users/profile
3. User modifies profile fields
4. Clicks "Save Changes"
5. Frontend calls PUT /api/v1/users/profile with data
6. Backend validates data against UpdateProfileDto
7. Backend updates User table for user fields
8. Backend updates/creates DonorProfile table for profile fields
9. Backend returns updated profile
10. Frontend displays success toast
11. Profile displays updated information
```

### Flow 4: Client Search for Donors

```
1. Client logs in and navigates to /search-donors
2. Frontend automatically calls GET /api/v1/client/search
3. Backend queries eligible donors (last donation > 90 days)
4. Returns list of donors with pagination
5. Frontend displays donors in table
6. User can filter by blood group, district, upazila, area
7. Frontend calls API with filter params
8. Backend returns filtered results
```

### Flow 5: Admin Role Management

```
1. Admin logs in and navigates to /roles
2. Frontend fetches all roles via GET /api/v1/roles
3. Admin clicks "Create Role" or edits existing role
4. Modal opens with form
5. Admin sets role name, description, permissions
6. Clicks Save
7. Frontend calls POST /api/v1/roles or PUT /api/v1/roles/:id
8. Backend creates/updates role in database
9. Role-Permission relationship updated
10. Frontend shows success and refreshes table
```

---

## 9. How to Run the Project

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to project root:**
   ```bash
   cd D:\AI Explore\noyon
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-here"
   PORT=3000
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Seed default data (optional):**
   The application will automatically create default roles and permissions on first run.

6. **Start the backend server:**
   ```bash
   npm run start:dev
   # or
   npm run start
   ```

   Backend runs at: `http://localhost:3000`
   API docs (Swagger): `http://localhost:3000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

   Frontend runs at: `http://localhost:3002`

### Default Login Credentials

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Donor | donor@example.com | donor123 |
| Client | client@example.com | client123 |

---

## 10. Learning Notes

### Important Concepts for Beginners

#### 1. REST API
REST (Representational State Transfer) is an architectural style for designing networked applications. REST APIs use HTTP methods:

- **GET** - Retrieve data
- **POST** - Create new data
- **PUT/PATCH** - Update existing data
- **DELETE** - Remove data

#### 2. JWT (JSON Web Token)
JWT is a compact, URL-safe token format for securely transmitting information between parties. It's commonly used for authentication.

```javascript
// JWT Structure: header.payload.signature
// Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
```

#### 3. Authentication vs Authorization

- **Authentication (AuthN)** - Verifying WHO you are (login)
- **Authorization (AuthZ)** - Verifying WHAT you can do (permissions)

#### 4. Role-Based Access Control (RBAC)
A security approach where access is based on user roles:

```
User → Role → Permissions → Access
```

#### 5. ORM (Object-Relational Mapping)
ORM tools like Prisma let you interact with databases using code instead of SQL:

```typescript
// Instead of: SELECT * FROM users WHERE id = 1
// You write:
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

#### 6. Middleware & Guards
- **Middleware** - Functions that run before route handlers
- **Guards** - Determine if a route should be accessed based on conditions (permissions, roles)

#### 7. DTO (Data Transfer Object)
DTOs define how data is sent between layers. They help with:
- Data validation
- Type safety
- API documentation (Swagger)

#### 8. Component-Based Architecture
React apps are built using reusable components:

```jsx
function MyComponent() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Content />
    </div>
  );
}
```

#### 9. State Management
State management handles data that changes over time:

- **Local State** - `useState` hook for component-specific data
- **Global State** - Context API for app-wide data (like user info)

#### 10. React Router
React Router enables client-side routing (navigation without page reloads):

```jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/users" element={<Users />} />
</Routes>
```

---

## Summary

This Blood Donation Website is a complete full-stack application demonstrating:

- **Modern frontend** with React and Chakra UI
- **Robust backend** with NestJS
- **Secure authentication** with JWT
- **Role-based access control** with granular permissions
- **Database management** with Prisma ORM

By studying this project, you can learn:
- How to structure a full-stack application
- How to implement authentication and authorization
- How to create REST APIs
- How to build responsive UIs
- How to work with databases

---

**Happy Learning!**
