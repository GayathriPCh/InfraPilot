# InfraPilot - System Architecture

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     InfraPilot Application                       │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │ Home Page   │
                         │   /         │
                         └──────┬──────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
           ┌────▼────┐   ┌─────▼─────┐   ┌────▼────┐
           │ Sign Up  │   │   Login   │   │ Builder │
           │ /signup  │   │  /login   │   │/builder │
           └────┬────┘   └─────┬─────┘   └────┬────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Auth Verified ✅    │
                    └───────────┬───────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
           ┌────▼──────┐               ┌───────▼───────┐
           │  Builder  │               │    History    │
           │  /builder │               │   /history    │
           └────┬──────┘               └───────┬───────┘
                │                               │
                │                      ┌────────▼────────┐
                │                      │ View all plans  │
                │                      │ Search & Filter │
                │                      │ Download plans  │
                │                      └────────┬────────┘
                │                               │
           ┌────▼──────────┐        ┌──────────▼─────────┐
           │ Generated     │        │  Download Options  │
           │ Architecture  │        │  ├─ JSON           │
           └────┬──────────┘        │  ├─ PDF            │
                │                   │  ├─ Text           │
           ┌────▼──────────┐        │  └─ CSV            │
           │ Save to DB    │        └────────────────────┘
           │ /history page │
           └───────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)              │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              React Components                        │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │ ✓ Login.tsx          ✓ Signup.tsx                   │    │
│  │ ✓ History.tsx        ✓ Navbar.tsx                   │    │
│  │ ✓ ProtectedRoute.tsx ✓ Index.tsx (Home)            │    │
│  └──────────────────────────────────────────────────────┘    │
│                            │                                   │
│  ┌──────────────────────────┴──────────────────────────┐     │
│  │         Context & Hooks (State Management)          │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ ✓ AuthContext.tsx        ✓ useAuth.ts             │     │
│  └──────────────────────────┬──────────────────────────┘     │
│                              │                                 │
│  ┌──────────────────────────┴──────────────────────────┐     │
│  │           Services (Business Logic)                │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ ✓ authService.ts         ✓ Firebase Auth          │     │
│  │ ✓ activityService.ts      ✓ Firestore Database    │     │
│  │ ✓ downloadService.ts      ✓ File Generation       │     │
│  └──────────────────────────┬──────────────────────────┘     │
│                              │                                 │
└──────────────────────────────┼─────────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        │                                              │
    ┌───▼────────┐                         ┌──────────▼──────┐
    │  Firebase  │                         │   Download API  │
    │    Auth    │                         │   (Browser)     │
    └──────┬─────┘                         └────────┬────────┘
           │                                        │
    ┌──────▼────────────┐              ┌────────────▼────────┐
    │  User Profiles   │              │   Generated Files   │
    │  Sessions        │              │   ├─ JSON          │
    └──────┬────────────┘              │   ├─ PDF           │
           │                           │   ├─ Text          │
    ┌──────▼────────────┐              │   └─ CSV           │
    │   Firestore DB   │              └────────────────────┘
    ├──────────────────┤
    │ users/          │
    │ ├─ uid: {...}   │
    │                  │
    │ activities/      │
    │ ├─ uid: {...}    │
    └──────────────────┘
```

## Component Architecture

```
App.tsx
├── AuthProvider
│   ├── Navbar
│   ├── Routes
│   │   ├── Public Routes
│   │   │   ├── /          → Index.tsx
│   │   │   ├── /login     → Login.tsx
│   │   │   └── /signup    → Signup.tsx
│   │   │
│   │   └── Protected Routes
│   │       ├── /builder      → Builder.tsx
│   │       ├── /history      → History.tsx
│   │       ├── /flow/*       → Various flows
│   │       └── /*-results    → Results pages
│   │
│   ├── Services (Hooks)
│   │   ├── useAuth()
│   │   ├── use-toast()
│   │   └── useActivity()
│   │
│   └── External Services
│       ├── Firebase Auth
│       ├── Firestore DB
│       ├── html2canvas
│       └── jsPDF

State Management Flow
─────────────────────
AuthContext
├── user: User | null
├── loading: boolean
├── signup()
├── login()
└── logout()

useAuth() hook
└── Returns AuthContextType

Protected Component
├── Checks user state
├── Shows loader while checking
├── Redirects to /login if needed
└── Shows component if authenticated
```

## Firestore Collections Structure

```
Firebase Project: ovps-2c71b
│
├── users/
│   └── {uid}
│       ├── email: string
│       ├── displayName: string
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
└── activities/
    └── {docId}
        ├── uid: string
        ├── activityType: "builder" | "docker" | "project" | "freeform"
        ├── title: string
        ├── description: string
        ├── input: string
        ├── services: string[]
        ├── connections: [{from, to, type}]
        ├── aiResponse: string
        ├── output: string
        ├── recommendations: string
        ├── status: "draft" | "completed"
        ├── tags: string[]
        ├── createdAt: Timestamp
        └── updatedAt: Timestamp
```

## Technology Stack

```
Frontend
├── React 18
├── TypeScript
├── Vite (Build tool)
├── React Router (Navigation)
├── TailwindCSS (Styling)
└── ShadCN/UI (Components)

Backend & Services
├── Firebase Authentication
├── Firestore Database
├── Firebase Storage (Ready)
└── HTML2Canvas + jsPDF (Export)

External APIs
├── Groq SDK (AI recommendations)
└── React Query (Data fetching)

Tools
├── Helmet (SEO)
├── React Hook Form (Forms)
└── Toast Notifications (UX)
```

## API Endpoints (Firebase SDK)

```
Authentication
├── signUp(email, password, displayName)
├── login(email, password)
├── logout()
├── getCurrentUser()
└── onAuthStateChange(callback)

Database (Firestore)
├── saveActivity(activityData)
├── getUserActivities(uid)
├── getUserActivitiesByType(uid, type)
├── updateActivity(activityId, updates)
├── deleteActivity(activityId)
└── searchActivities(uid, term)

Storage (Download)
├── downloadJSON(data, filename)
├── downloadYAML(data, filename)
├── downloadText(data, filename)
├── downloadPDF(content, filename)
├── downloadCSV(data, filename)
└── downloadArchitecturePlan(...)
```

## Security Layers

```
1. Authentication Layer
   └── Firebase Auth (Email/Password)
       └── JWT tokens
           └── Browser storage

2. Authorization Layer
   └── Protected Routes
       └── Check AuthContext.user
           └── Redirect if needed

3. Database Layer
   └── Firestore Security Rules
       └── User can only access own data
           └── UID verification on writes

4. Session Management
   └── Firebase Persistence
       └── Browser Local Storage
           └── Auto-login on refresh
```

## User Authentication Flow

```
┌─────────────────────────────────────────────┐
│         User Registration Flow              │
└─────────────────────────────────────────────┘

User visits /signup
    ↓
Fills form (name, email, password)
    ↓
Clicks Sign Up
    ↓
authService.signup()
    ├─ Firebase createUserWithEmailAndPassword()
    ├─ Get user UID
    ├─ Create user profile in Firestore
    └─ Auto-login (Firebase handles this)
    ↓
Redirected to home page
    ↓
User is authenticated! ✅


┌─────────────────────────────────────────────┐
│           User Login Flow                   │
└─────────────────────────────────────────────┘

User visits /login
    ↓
Fills form (email, password)
    ↓
Clicks Login
    ↓
authService.login()
    └─ Firebase signInWithEmailAndPassword()
    ↓
Session stored in browser
    ↓
Page refresh → Firebase checks stored token
    ↓
User stays logged in ✅


┌─────────────────────────────────────────────┐
│      Protected Route Access Flow            │
└─────────────────────────────────────────────┘

User clicks "Builder" link
    ↓
Route: /builder (Protected)
    ↓
ProtectedRoute wrapper checks:
├─ Is user loaded? (Show spinner if not)
├─ Is user logged in? (Check useAuth())
└─ No user? Redirect to /login

If authenticated:
    └─ Show Builder page ✅

If not authenticated:
    └─ Redirect to /login
        ↓
    After login, back to /builder ✅
```

## Performance Considerations

```
Code Splitting
├── Dynamic imports for Groq SDK
├── Lazy load result pages
└── Separate chunks for large libraries

Caching
├── Browser Local Storage (session)
├── Firebase Persistence (auth)
└── Service Worker ready (future)

Optimization
├── CSS minification (TailwindCSS)
├── JS minification (Vite)
├── Image optimization
└── Lazy component loading
```

This architecture ensures:
✅ Clean separation of concerns
✅ Secure user data storage
✅ Scalable authentication system
✅ Easy to maintain and extend
✅ Production-ready infrastructure
