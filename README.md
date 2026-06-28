<div align="center">

# 🍔 QuickBite

### Premium Food Delivery Platform

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**A full-stack food delivery application with a stunning dark-themed UI, JWT authentication, role-based access, real-time cart management, multi-step checkout, and an admin dashboard.**

[Live Demo](#) · [API Docs](docs/API_DOCS.md) · [Architecture](docs/ARCHITECTURE.md) · [Setup Guide](docs/SETUP_GUIDE.md)

</div>

---

## ✨ Features

### 🛒 Customer Experience
- **Beautiful Menu Browsing** — Filter by category, cuisine, dietary preference with debounced search
- **Smart Cart** — Persistent cart with localStorage, quantity controls, real-time price calculations
- **Multi-Step Checkout** — Address → Payment → Confirmation with progress tracking
- **Order Tracking** — Visual timeline showing order status progression
- **User Profiles** — Multiple saved delivery addresses, order history

### 🔐 Authentication & Security
- **JWT Authentication** — Secure token-based auth with 30-day expiry
- **Password Hashing** — bcrypt with salt rounds for secure storage
- **Role-Based Access** — Customer vs Admin protected routes
- **Auto-Logout** — Token expiry handling with seamless redirect

### 👨‍💼 Admin Dashboard
- **Analytics Overview** — Total orders, revenue, users, average order value
- **Menu Management** — Full CRUD for menu items with image preview
- **Order Management** — Update order statuses, view all orders, filter by status

### 🎨 UI/UX
- **Dark Luxe Theme** — Premium dark mode with glassmorphism and orange accents
- **Micro-Animations** — Staggered fade-ins, hover lifts, slide-in drawers, pulse effects
- **Mobile-First** — Responsive from 320px to 1440px with bottom navigation
- **Skeleton Loading** — Shimmer loading states for all async data
- **Toast Notifications** — Success, error, info feedback for all actions

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Fast SPA with HMR |
| **Styling** | Vanilla CSS | Custom design system with glassmorphism |
| **State** | Context API + useReducer | Global auth & cart state management |
| **Routing** | React Router v6 | Client-side navigation with protected routes |
| **Icons** | Lucide React | Beautiful, consistent iconography |
| **HTTP** | Axios | API calls with interceptors |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB + Mongoose | Document-based data storage |
| **Auth** | JWT + bcrypt | Secure authentication |
| **Validation** | express-validator | Server-side input validation |

---

## 📁 Project Structure

```
quickbite/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # 25+ reusable components
│   │   │   ├── admin/          # Admin dashboard components
│   │   │   ├── auth/           # Login & Register forms
│   │   │   ├── cart/           # Cart drawer & items
│   │   │   ├── checkout/       # Multi-step checkout flow
│   │   │   ├── home/           # Landing page sections
│   │   │   ├── layout/         # Navbar, Footer, MobileNav
│   │   │   ├── menu/           # Menu grid, cards, filters
│   │   │   ├── orders/         # Order cards & timeline
│   │   │   └── ui/             # Button, Card, Input, Modal, etc.
│   │   ├── context/            # Auth, Cart, Theme providers
│   │   ├── hooks/              # useAuth, useCart, useDebounce
│   │   ├── pages/              # 9 page components
│   │   ├── services/           # Axios API layer
│   │   └── utils/              # Constants, formatters, validators
│   └── package.json
│
├── server/                     # Express backend
│   ├── config/                 # Database connection
│   ├── controllers/            # Route handlers
│   ├── middleware/              # Auth, admin, error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── seed/                   # Database seed script
│   └── package.json
│
├── docs/                       # Documentation
│   ├── HOW_IT_WORKS.md         # Step-by-step explanation
│   ├── API_DOCS.md             # Full API reference
│   ├── ARCHITECTURE.md         # System design
│   └── SETUP_GUIDE.md          # Local dev setup
│
├── .env.example                # Environment variables template
├── .gitignore
└── README.md                   # You are here!
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** free account ([Sign up](https://cloud.mongodb.com/)) — no credit card needed
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/quickbite.git
cd quickbite
```

### 2. Setup Backend

```bash
cd server
npm install

# Create .env file (copy from template)
cp ../.env.example .env
# Edit .env with your MongoDB Atlas connection string and JWT secret
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- 🧑‍💼 Admin account: `admin@quickbite.com` / `admin123`
- 👤 Test account: `user@quickbite.com` / `user123`
- 🍔 30+ realistic menu items across all categories

### 4. Setup Frontend

```bash
cd ../client
npm install
```

### 5. Run the App

Open **two terminals**:

```bash
# Terminal 1 — Backend (from /server)
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 — Frontend (from /client)
npm run dev
# App opens on http://localhost:5173
```

### 6. Open in Browser
Navigate to `http://localhost:5173` and start exploring! 🎉

---

## 🔑 API Overview

| Resource | Endpoints | Auth Required |
|----------|-----------|--------------|
| **Auth** | Register, Login, Profile, Address | Partial |
| **Menu** | List, Search, Filter, CRUD | Admin for write |
| **Orders** | Create, List, Track, Status update | Yes |

**18 RESTful endpoints** with consistent response format. [Full API docs →](docs/API_DOCS.md)

---

## 🎨 Design System

The app uses a custom CSS design system with 50+ design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--bg-card` | `#141414` | Card backgrounds |
| `--accent` | `#FF6B35` | Primary brand color |
| `--accent-gradient` | `#FF6B35 → #E63946` | Buttons, highlights |
| `--glass-bg` | `rgba(255,255,255,0.05)` | Glassmorphism effect |
| `--text-primary` | `#FFFFFF` | Main text |
| `--radius-lg` | `16px` | Cards, modals |
| `--shadow-glow` | `0 0 30px rgba(255,107,53,0.15)` | Accent glow effects |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| 1440px+ | 4-column menu grid, full sidebar |
| 1024px | 3-column grid |
| 768px | 2-column grid, hamburger menu |
| 576px | Single column, bottom nav |
| 320px | Compact mobile layout |

---

## 🚢 Deployment (All FREE)

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | [Vercel](https://vercel.com) | Free |
| Backend | [Render](https://render.com) | Free |
| Database | [MongoDB Atlas M0](https://cloud.mongodb.com) | Free (512MB) |

See [Deployment Guide](docs/SETUP_GUIDE.md#deployment) for step-by-step instructions.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ and lots of ☕**

⭐ Star this repo if you found it helpful!

</div>
