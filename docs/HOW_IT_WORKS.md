# 🧠 How QuickBite Works — Explained Simply

> This guide explains every part of QuickBite like you're 5 (okay, maybe 10).
> Read this before your interview and you'll be able to explain any part of the code.

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [How the Frontend Works](#how-the-frontend-works)
3. [How the Backend Works](#how-the-backend-works)
4. [How Data Flows](#how-data-flows)
5. [How Authentication Works](#how-authentication-works)
6. [How the Cart Works](#how-the-cart-works)
7. [How Protected Routes Work](#how-protected-routes-work)
8. [How the Database is Structured](#how-the-database-is-structured)
9. [What Each File Does](#what-each-file-does)

---

## The Big Picture

QuickBite is like a restaurant with two halves:

```
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│                     │  HTTP   │                     │ Mongoose │              │
│   FRONTEND (React)  │ ──────► │  BACKEND (Express)  │ ───────► │   MongoDB    │
│   "The Waiter"      │ ◄────── │  "The Kitchen"      │ ◄─────── │  "The Fridge"│
│                     │  JSON   │                     │   Data   │              │
└─────────────────────┘         └─────────────────────┘         └──────────────┘
     Port 5173                        Port 5000                   Atlas Cloud
```

- **Frontend (React)** = The waiter. It takes your order (clicks, form inputs) and shows you what's available (menu, cart, order status). It talks to the kitchen.
- **Backend (Express)** = The kitchen. It receives orders from the waiter, processes them (validates data, checks permissions), and stores/retrieves data from the fridge.
- **Database (MongoDB)** = The fridge. It stores everything — users, menu items, orders. The kitchen reads from and writes to it.

### How They Talk

The frontend and backend talk using **HTTP requests** (like letters):

```
Frontend says: "GET /api/menu" → "Hey kitchen, give me all the menu items"
Backend replies: { success: true, data: [{ name: "Burger", price: 9.99 }, ...] }

Frontend says: "POST /api/orders" + { items, address } → "New order!"
Backend replies: { success: true, data: { orderId: "123", status: "placed" } }
```

---

## How the Frontend Works

### React Components = LEGO Blocks

Think of each component as a LEGO block. Small blocks combine to make bigger blocks:

```
Home Page (big block)
├── Navbar (medium block)
│   ├── Logo (small block)
│   ├── Nav Links (small block)
│   └── Cart Icon (small block)
├── Hero (medium block)
│   ├── Heading (small block)
│   ├── Search Bar (small block)
│   └── CTA Buttons (small block)
├── Category Scroller (medium block)
│   └── Category Pill (small block) × 7
├── Featured Items (medium block)
│   └── Menu Card (small block) × 6
└── Footer (medium block)
```

### State Management = The App's Memory

The app needs to "remember" things — who's logged in, what's in the cart, etc. We use **React Context** for this:

```
App
└── AuthProvider (remembers: who's logged in)
    └── CartProvider (remembers: what's in the cart)
        └── ThemeProvider (remembers: dark/light mode)
            └── All your pages and components
```

**Why Context?** Without it, you'd have to pass data through every component like a game of telephone. Context lets ANY component access shared data directly.

```javascript
// WITHOUT Context (prop drilling nightmare):
<App user={user}>
  <Layout user={user}>
    <Navbar user={user}>
      <UserMenu user={user} />  // 4 levels deep just to know who's logged in!
    </Navbar>
  </Layout>
</App>

// WITH Context (clean):
<AuthProvider>  // Wraps everything, provides user data
  <App>
    <Layout>
      <Navbar>
        <UserMenu />  // Just calls useAuth() to get user data
      </Navbar>
    </Layout>
  </App>
</AuthProvider>
```

### Routing = Which Page to Show

React Router decides which page to display based on the URL:

```
http://localhost:5173/           → Home page
http://localhost:5173/menu       → Menu page
http://localhost:5173/checkout   → Checkout page (must be logged in)
http://localhost:5173/orders     → Orders page (must be logged in)
http://localhost:5173/admin      → Admin page (must be admin)
http://localhost:5173/anything   → 404 Not Found page
```

---

## How the Backend Works

### Express = A Mail Room

Express is like a mail room that receives letters (HTTP requests) and routes them to the right department:

```
Request arrives: POST /api/auth/login

Express checks:
1. Does this path exist? → Yes, /api/auth routes
2. Any middleware to run first? → JSON body parser
3. Which handler? → authController.login
4. Run the handler → Validate email/password, create token
5. Send response → { success: true, token: "..." }
```

### Middleware = Security Checkpoints

Middleware runs BEFORE the actual handler. Think of them as security checkpoints:

```
Request: GET /api/orders
    │
    ▼
[CORS Middleware] → "Is this request allowed from this origin? ✓"
    │
    ▼
[JSON Parser] → "Parse the request body as JSON ✓"
    │
    ▼
[Auth Middleware] → "Does this request have a valid JWT token? ✓"
    │
    ▼
[Controller] → "Okay, fetch and return the orders"
```

### Controllers = The Workers

Controllers are functions that do the actual work:

```javascript
// What happens when someone hits GET /api/menu:
const getMenuItems = async (req, res) => {
  // 1. Read query parameters (search, category, page, etc.)
  // 2. Build a MongoDB query based on those parameters
  // 3. Execute the query against the database
  // 4. Send the results back as JSON
};
```

---

## How Data Flows

### Complete Flow: User Adds Item to Cart then Places Order

```
Step 1: User clicks "Add to Cart" on a burger
    └── MenuCard component calls cartContext.addItem(burger)
        └── CartContext reducer: ADD_ITEM action
            └── Updates cart state + saves to localStorage
                └── Cart icon badge updates (shows "1")

Step 2: User clicks "Proceed to Checkout"
    └── Router navigates to /checkout
        └── ProtectedRoute checks: is user logged in?
            └── If no → redirect to /login
            └── If yes → show CheckoutSteps component

Step 3: User fills address → selects payment → clicks "Place Order"
    └── CheckoutSteps calls orderService.createOrder(orderData)
        └── Axios sends POST /api/orders with JWT in header
            └── Express receives request
                └── auth middleware verifies JWT ✓
                    └── orderController.createOrder runs:
                        1. Validates items exist in database
                        2. Calculates subtotal, tax (8%), delivery fee
                        3. Creates Order document in MongoDB
                        4. Returns order details
                            └── Frontend receives response
                                └── Shows OrderConfirmation with animation
                                    └── Cart is cleared

Step 4: User can view order in /orders
    └── Orders page calls orderService.getUserOrders()
        └── Backend returns orders for this user
            └── OrderCard shows each order with status timeline
```

---

## How Authentication Works

### The JWT Flow (Step by Step)

```
1. REGISTER
   User fills form → Frontend sends POST /api/auth/register
   → Backend: hash password with bcrypt → save to MongoDB
   → Backend: create JWT token (contains user ID + role)
   → Frontend: receives token → stores in localStorage
   → Frontend: sets user in AuthContext → app re-renders as "logged in"

2. SUBSEQUENT REQUESTS
   Every API call → Axios interceptor adds token to header:
   headers: { Authorization: "Bearer eyJhbGciOiJI..." }
   → Backend: auth middleware extracts token from header
   → Backend: jwt.verify(token, secret) → gets { id, role }
   → Backend: attaches user info to request → handler proceeds

3. LOGOUT
   User clicks Logout → Frontend: clear localStorage, clear AuthContext
   → No API call needed! The token just stops being sent.

4. TOKEN EXPIRY
   Token expires after 30 days → Backend returns 401
   → Axios response interceptor catches 401
   → Clears token, redirects to /login
```

### What's Inside a JWT Token?

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTEyMzQ1Njc4OTAiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2ODg0NTY3ODksImV4cCI6MTY5MTA0ODc4OX0.K7X3Z...

Decoded:
Header:  { "alg": "HS256", "typ": "JWT" }          // Algorithm used
Payload: { "id": "64a1234567890", "role": "customer", "iat": 1688456789, "exp": 1691048789 }
Signature: HMACSHA256(header + payload, secret)     // Proves it's not tampered
```

---

## How the Cart Works

### useReducer Pattern (Like a State Machine)

```javascript
// The cart has a REDUCER — a function that takes the current state
// and an ACTION, and returns the NEW state.

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // If item already in cart → increase quantity
      // If new item → add to cart array
      return { ...state, items: updatedItems };

    case 'REMOVE_ITEM':
      // Filter out the item by ID
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };

    case 'UPDATE_QUANTITY':
      // Find item, update its quantity
      // If quantity becomes 0 → remove item
      return { ...state, items: updatedItems };

    case 'CLEAR_CART':
      return { ...state, items: [] };
  }
}

// Components use it like this:
const { addItem, removeItem, updateQuantity } = useCart();
// When user clicks "+":
addItem(menuItem);  // This dispatches { type: 'ADD_ITEM', payload: menuItem }
```

### localStorage Persistence

```javascript
// Every time the cart changes, we save it:
useEffect(() => {
  localStorage.setItem('quickbite_cart', JSON.stringify(state.items));
}, [state.items]);

// When the app first loads, we restore it:
useEffect(() => {
  const saved = localStorage.getItem('quickbite_cart');
  if (saved) dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
}, []);

// This means: close the browser, come back tomorrow → cart is still there!
```

---

## How Protected Routes Work

```jsx
// A Protected Route is a wrapper that checks if you're allowed to see a page:

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;           // Still checking token...
  if (!user) return <Navigate to="/login" />;  // Not logged in → go to login
  return children;                            // Logged in → show the page
}

// Usage in routing:
<Route path="/orders" element={
  <ProtectedRoute>      {/* Guard */}
    <Orders />          {/* Only renders if logged in */}
  </ProtectedRoute>
} />

// Admin route adds an extra check:
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;  // Not admin → go home
  return children;
}
```

---

## How the Database is Structured

### MongoDB Collections (like Excel sheets)

```
Database: quickbite
├── users collection
│   └── Each document: { name, email, password (hashed), role, addresses[] }
│
├── menuitems collection
│   └── Each document: { name, description, price, category, image, rating, prepTime, tags[] }
│
└── orders collection
    └── Each document: { user (→links to users), items[], deliveryAddress, total, status }
```

### Relationships

```
User ──────┐
           │ user field (ObjectId reference)
           ▼
Order ─────┤
           │ menuItem field (ObjectId reference)
           ▼
MenuItem ──┘

// When we fetch an order, we can "populate" to get full details:
Order.find({ user: userId }).populate('items.menuItem')
// This replaces the ObjectId with the actual MenuItem document
```

---

## What Each File Does

### Backend Files

| File | Purpose | Interview Sound Bite |
|------|---------|---------------------|
| `server.js` | App entry point, starts Express, connects to DB | "This is the main file that bootstraps the entire backend" |
| `config/db.js` | MongoDB connection setup | "Handles database connection with error handling and event logging" |
| `models/User.js` | User schema + password hashing | "Defines user data structure with a pre-save hook for bcrypt hashing" |
| `models/MenuItem.js` | Menu item schema with text index | "Includes a compound text index on name and description for full-text search" |
| `models/Order.js` | Order schema with status history | "Tracks order lifecycle with a statusHistory array for timeline display" |
| `middleware/auth.js` | JWT verification | "Extracts and verifies the Bearer token, attaching the decoded user to the request" |
| `middleware/admin.js` | Admin role check | "A simple authorization middleware that chains after auth to check the user's role" |
| `middleware/errorHandler.js` | Global error handler | "Catches all errors and formats them consistently — handles Mongoose validation errors, duplicates, and cast errors" |
| `controllers/authController.js` | Login, register, profile | "Handles the full auth lifecycle — registration, login, and profile management" |
| `controllers/menuController.js` | Menu CRUD + search/filter | "Supports server-side search, multi-field filtering, pagination, and sorting" |
| `controllers/orderController.js` | Order lifecycle | "Manages order creation with price calculation, status updates, and admin analytics" |
| `routes/*.js` | URL → Controller mapping | "Maps HTTP methods and paths to controller functions with appropriate middleware" |
| `seed/seedData.js` | Database seeder | "Populates the database with realistic test data for development and demos" |

### Frontend Files

| File | Purpose | Interview Sound Bite |
|------|---------|---------------------|
| `index.css` | Design system | "A comprehensive CSS design system with 50+ custom properties, glassmorphism, and animations" |
| `App.css` | Component styles | "All component-specific styles organized by section with clear documentation" |
| `context/AuthContext.jsx` | Auth state | "Manages authentication state globally with token persistence and auto-verification" |
| `context/CartContext.jsx` | Cart state | "Uses useReducer for predictable cart state transitions with localStorage persistence" |
| `services/api.js` | HTTP client | "Axios instance with request/response interceptors for token injection and error handling" |
| `components/ui/*` | Reusable UI | "A library of styled, accessible components that follow the design system" |
| `components/home/*` | Landing page | "Engaging landing page sections designed to convert visitors into users" |
| `components/menu/*` | Menu system | "Server-powered menu with search, filters, and responsive grid layout" |
| `components/cart/*` | Cart system | "Slide-in drawer with real-time quantity controls and price calculation" |
| `components/checkout/*` | Checkout flow | "Multi-step form with progress tracking and order confirmation" |
| `pages/*` | Page components | "Top-level route components that compose smaller components into full pages" |
| `hooks/*` | Custom hooks | "Encapsulate reusable logic like auth state access and input debouncing" |

---

## 🎤 Interview Tips

### If asked "Walk me through your project":
> "QuickBite is a full-stack food delivery app. The frontend is React with Vite, styled with a custom CSS design system featuring glassmorphism and animations. State management uses Context API with useReducer for the cart. The backend is Express with MongoDB, featuring JWT auth, role-based access, and 18 RESTful endpoints. The cart persists in localStorage, and the checkout is a multi-step flow with address and payment forms."

### If asked "What was the hardest part?":
> "The cart state management was tricky — I had to handle edge cases like adding duplicate items (increment quantity instead of adding twice), syncing with localStorage on every change, calculating dynamic delivery fees, and making sure the cart drawer UI updated smoothly with animations."

### If asked "How do you handle authentication?":
> "I use JWT tokens. On login, the server creates a signed token containing the user ID and role, which the client stores in localStorage. An Axios interceptor automatically attaches it to every request. The server's auth middleware verifies the token and attaches the user info to the request object. For admin routes, a second middleware checks the role field."

### If asked "How would you scale this?":
> "For the frontend, I'd add React.lazy and Suspense for code splitting, and implement a service worker for offline menu caching. For the backend, I'd add Redis for session caching, implement rate limiting, add image uploads to Cloudinary instead of URL strings, and set up WebSocket connections for real-time order tracking."
