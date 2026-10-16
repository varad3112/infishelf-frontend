# InfiShelf Frontend — Intelligent Retail Catalog & AI Search Platform 🛒✨

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff.svg)](https://vitejs.dev/)
[![Lucide Icons](https://img.shields.io/badge/Lucide--React-Latest-orange.svg)](https://lucide.dev/)

> Modern, minimalist, and responsive Single Page Application (SPA) built with React and Vite for **InfiShelf** — an intelligent product management and AI-assisted search platform.

---

## 📑 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Design Aesthetics & UI System](#-design-aesthetics--ui-system)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Scripts](#-scripts)
- [Integration with Backend](#-integration-with-backend)

---

## 🛠️ Architecture & Tech Stack

- **Core Library:** React 19 (Functional components, Custom hooks, Context API)
- **Build Tool:** Vite with fast Hot Module Replacement (HMR)
- **Styling:** Modular Vanilla CSS with comprehensive CSS custom properties (Design Tokens)
- **Icons:** `lucide-react`
- **HTTP Client:** Fetch API with interceptors, token refresh, and standardized error handling (`services/api.js`)
- **Currency:** Indian Rupee (`Rs.`) formatted across all views

---

## 🎨 Design Aesthetics & UI System

- **Minimalist & Clean:** Pure, solid background tones (`#0d1527` deep navy surface, `#131f38` card background, `#1b2a4a` borders) without jarring neon glows.
- **Accents:** Crisp enterprise amber (`#f59e0b`) for primary CTAs and sky cyan (`#0284c7`) for badges and active filter tags.
- **Micro-Interactions:** Smooth hover transitions on cards, interactive modal backdrops, and password visibility toggle with eye icons.
- **Three Core States for Data Views:**
  1. *Loading State:* Shimmering skeleton loaders matching the exact product card grid layout.
  2. *Empty State:* Clean icon-backed notice with quick "Reset Filters" action.
  3. *Error State:* Meaningful error banner with retry trigger.

---

## ✨ Key Features

1. **Authentication Experience:**
   - Registration with instant client-side password matching validation and token reception.
   - Login with interactive password visibility toggle (`Eye` / `EyeOff` icons).
   - Stateless JWT storage in `localStorage` with automatic Authorization Bearer headers.
   - Persistent user profile session via `AuthContext`.

2. **Interactive Product Catalog:**
   - Responsive multi-column grid layout (mobile, tablet, desktop).
   - High-fidelity product packshots stored locally in `public/products/`.
   - Real-time live keyword search with 300ms debounce.
   - Category and brand sidebar filters with dynamic counts.
   - Dual-slider price range filtering.
   - Multi-option sorting (Newest, Price: Low to High, Price: High to Low, Name A-Z).
   - Responsive pagination controls.

3. **Product Management (CRUD Modal):**
   - Clean, accessible modal for adding and updating products.
   - Integrated **AI Description Generator**: One click asks the backend Gemini service to generate an engaging, retail-ready product description and semantic tags.
   - Client-side validation for required fields, non-negative pricing, and image URLs.
   - Role-guarded delete confirmation with safety checks.

4. **Natural Language AI Smart Search:**
   - Query parser translates everyday queries (e.g., *"organic dairy products under Rs. 150"*) into filtered results with matched intent feedback.

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── products/             # High-quality packshots (Maggi, Coke, Horlicks, etc.)
│   └── favicon.ico
├── src/
│   ├── assets/               # Brand assets and SVG icons
│   ├── components/
│   │   ├── auth/             # LoginModal, RegisterModal
│   │   ├── catalog/          # ProductCard, ProductGrid, ProductFilters, SearchBar
│   │   ├── common/           # Button, Input, Modal, Badge, SkeletonLoader, Toast
│   │   ├── layout/           # Navbar, Footer
│   │   └── product/          # ProductFormModal (CRUD & AI description generator)
│   ├── context/
│   │   └── AuthContext.jsx   # Global user state & authentication provider
│   ├── hooks/
│   │   ├── useDebounce.js    # Debounce hook for real-time search
│   │   └── useProducts.js    # Data fetching & catalog filter state
│   ├── services/
│   │   ├── api.js            # Base Fetch client with interceptors
│   │   ├── authService.js    # Login, register, me endpoints
│   │   └── productService.js # CRUD, category, brand, and AI endpoints
│   ├── styles/
│   │   ├── variables.css     # Design tokens (colors, typography, spacing, shadows)
│   │   └── index.css         # Reset & global styles
│   ├── App.jsx               # Main application view & state composition
│   ├── App.css               # Page-level styles
│   └── main.jsx              # React DOM entrypoint
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .env.example
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone & Navigate
```bash
git clone https://github.com/varad3112/infishelf-frontend.git
cd infishelf-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your running backend (`http://localhost:8000/api`).

### 4. Start Development Server
```bash
npm run dev
```
The application will launch on: **http://localhost:5173/**

---

## 📦 Scripts

- `npm run dev` — Launch Vite local development server with HMR.
- `npm run build` — Build optimized, minified production assets into `dist/`.
- `npm run preview` — Locally preview the production build.

---

## 🔗 Integration with Backend

This frontend consumes the **InfiShelf Django REST API**:
- **Backend Repo:** [https://github.com/varad3112/infishelf-backend.git](https://github.com/varad3112/infishelf-backend.git)
- **API Base:** `http://localhost:8000/api/`
- **Swagger Docs:** `http://localhost:8000/api/docs/`
