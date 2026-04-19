# Suhada Furniture — AI-Powered Furniture Store & Management System

A full-stack furniture store and inventory/order management system built with a modern React storefront + admin dashboard and a Spring Boot REST API. The project highlights **production-focused backend engineering** (JWT security, role-based access, database migrations, file uploads) and **AI-powered search** (Google Gemini) plus a **3D/AR product viewer** to improve customer decision-making.

---

## Project Overview

### What it does
- Provides a **public furniture catalog** (browse, search, categories, product details).
- Provides an **admin/staff dashboard** for managing products, customers, and order workflows.
- Adds an **AI Product Finder** that interprets natural-language queries and returns ranked product matches with explanations.
- Supports an interactive **3D viewer** (and an AR-friendly mode) for products that have an uploaded 3D model.

### The problem it solves
Furniture shopping and store operations often suffer from:
- Poor search relevance (users describe what they want, not what to type).
- Incomplete product visualization (hard to judge scale/style from 2D images).
- Manual and error-prone inventory/order handling.

### Key idea behind the system
Combine a standard e-commerce-style catalog + operations dashboard with:
- **AI intent extraction** (Gemini) to turn user language into structured filters/ranking.
- **3D/AR viewing** to reduce uncertainty and increase confidence in purchases.
- **Role-based backend controls** to reflect real operational workflows (customer vs staff vs admin).

---

## Features

### Customer / Public Features (Frontend)
- **Home / About / Contact** pages
- **Product catalog**
  - Browse products
  - Category filtering
  - Search by keyword
  - Pagination support (backend provides `/api/products/paginated`)
  - Product cards with stock status (in stock / low stock / out of stock)
- **Product details**
  - Image gallery + zoom
  - Related products by category
  - Share link / copy link fallback
  - Local wishlist (saved in `localStorage`)
  - Quick contact links (WhatsApp / phone)
- **Authentication UI**
  - Register + Login forms
  - Role selection on registration (Customer / Staff / Admin)

### Admin / Staff Features (Frontend)
- **Admin layout and navigation** under `/admin`
- **Admin Dashboard**
  - KPI cards (revenue/orders/customers/products)
  - Low-stock preview list (based on product stock)
  - Recent orders preview (UI-ready)
- **Product management (CRUD UI)**
  - Create / edit / delete products
  - Search + filter by category (client-side filters on paginated list)
  - Sorting + pagination UI
  - Image URL field (stores product image URLs)
- **Customer management**
  - Customer listing + detail modal
  - Pulls from backend when available; falls back to mock data for demo
- **Order management (UI-ready)**
  - Order listing + status filtering
  - Status update UX (currently mock data; backend endpoints exist)

### Backend (Spring Boot API) Features
- **JWT authentication**
  - Register, login, “current user” endpoint
- **Role-based access control**
  - Public read access for product/customer GET endpoints
  - Restricted write access for product and 3D uploads (Staff/Admin)
  - Admin-only destructive operations (DELETE endpoints)
- **Product management**
  - CRUD
  - Search
  - Category filtering
  - Pagination + sorting
  - Low-stock detection (service + repository support)
- **Customer management**
  - CRUD + search (by query/city/email)
- **Order management**
  - Create order with stock validation
  - Query by order number, customer, status, recent, date range
  - Update status + cancel flow (restores stock on cancel)
- **File uploads**
  - Upload/download/delete files via REST (`/api/files/**`)
- **3D model management**
  - Upload/check/get/delete 3D model URL for a product
- **3D Viewer pages (Thymeleaf)**
  - `/viewer/3d` list viewer
  - `/viewer/3d/{productId}` single-product viewer (supports `?mode=ar`)
- **AI Product Finder**
  - Auth-protected AI endpoint
  - Rate-limited to prevent abuse/cost spikes (best-effort in-memory limiter)
  - Gemini integration includes caching + circuit-breaker style protection
  - Fallback keyword parsing if Gemini is unavailable (keeps the feature usable)
- **Database migrations**
  - Flyway migration included for baseline performance indexes
- **API documentation**
  - Swagger/OpenAPI via SpringDoc (`/swagger-ui.html`)

---

## Tech Stack

### Frontend
- **React 19** + **Vite**
- **React Router**
- **Tailwind CSS**
- **Zustand** (auth state)
- **Axios** (API calls)
- **Framer Motion** (animations)

### Backend
- **Java 17**
- **Spring Boot 3**
  - Spring Web (REST API)
  - Spring Security (JWT + RBAC)
  - Spring Data JPA
  - Spring Mail (service present; production wiring can be completed)
  - SpringDoc OpenAPI (Swagger UI)
  - Spring WebFlux (WebClient used for Gemini REST calls)
  - Actuator (health endpoint; used by Docker healthcheck)
- **Flyway** migrations

### Database
- **MySQL**

### AI / External APIs
- **Google Gemini API** (REST)

### DevOps / Tools
- **Dockerfiles** for both frontend (Nginx) and backend (JAR runtime image)
- **Nginx** config for SPA routing + caching (frontend container)

---

## System Architecture (High-Level)

- **React (Vite) SPA** provides the storefront UI and admin dashboard UI.
- **Spring Boot REST API** provides authentication, product/customer/order CRUD, file uploads, and AI endpoints.
- **MySQL** stores entities like `Product`, `Customer`, `Order`, `User`.
- **Thymeleaf viewer routes** (`/viewer/**`) are served directly by the backend for 3D/AR viewing.
- **Gemini integration** runs server-side:
  - Backend builds a prompt, calls Gemini, extracts intent, ranks products from DB.
  - Includes caching and circuit protection to reduce cost and improve resilience.

---

## Setup & Installation (Local Development)

### Prerequisites
- **Node.js 20+**
- **Java 17**
- **Maven 3.9+**
- **MySQL 8+**

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd Suhada
```

### 2) Backend setup (Spring Boot)

1. Create a MySQL database:

```sql
CREATE DATABASE suhada_furniture;
```

2. Create your backend config file:
- Copy `backend/src/main/resources/application.properties.example`
- Rename it to `backend/src/main/resources/application.properties`
- Update secrets and DB credentials

**Required configuration keys**
- `DB_PASSWORD`
- `JWT_SECRET`
- `MAIL_PASSWORD` (if enabling real email sending)
- `GEMINI_API_KEY`

3. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 3) Frontend setup (React + Vite)

1. Create your frontend env file:
- Copy `frontend/.env.example`
- Rename it to `frontend/.env`
- Confirm:
  - `VITE_API_BASE_URL=http://localhost:8080/api`
  - `VITE_BACKEND_BASE_URL=http://localhost:8080` (used to open `/viewer/3d/...`)

2. Install and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (default Vite port).

---

## Usage

### Public users
- Browse: `http://localhost:5173/products`
- View product details: click any product card
- AI Product Finder: `http://localhost:5173/ai-finder`
  - Note: AI endpoints require authentication (JWT).

### Admin / Staff
- Log in with an admin account and open: `http://localhost:5173/admin`
- Manage inventory:
  - Products: `/admin/products`
  - Customers: `/admin/customers`
  - Orders: `/admin/orders`

### 3D / AR Viewer
- Viewer (all products): `http://localhost:8080/viewer/3d`
- Viewer (single product): `http://localhost:8080/viewer/3d/{productId}`
- AR hint mode: `http://localhost:8080/viewer/3d/{productId}?mode=ar`

---

## API Endpoints (Major)

Base URL: `http://localhost:8080`

### Auth
- **POST** `/api/auth/register`: Register a new user (role supported)
- **POST** `/api/auth/login`: Login and receive JWT
- **GET** `/api/auth/me`: Get the current authenticated user

### Products
- **GET** `/api/products`: List all products
- **GET** `/api/products/paginated`: Paginated products (page/size/sortBy/sortDir)
- **GET** `/api/products/{id}`: Get product by id
- **GET** `/api/products/sku/{sku}`: Get product by SKU
- **GET** `/api/products/category/{category}`: Filter by category
- **GET** `/api/products/search?query=...`: Search by name/keyword
- **GET** `/api/products/low-stock`: Low-stock products
- **POST** `/api/products`: Create product (Staff/Admin)
- **PUT** `/api/products/{id}`: Update product (Staff/Admin)
- **DELETE** `/api/products/{id}`: Delete product (Admin)

### Customers
- **GET** `/api/customers`: List customers
- **GET** `/api/customers/{id}`: Get customer by id
- **GET** `/api/customers/email/{email}`: Get customer by email
- **GET** `/api/customers/search?query=...`: Search customers
- **GET** `/api/customers/city/{city}`: Customers by city
- **POST** `/api/customers`: Create customer
- **PUT** `/api/customers/{id}`: Update customer
- **DELETE** `/api/customers/{id}`: Delete customer (Admin)

### Orders
- **POST** `/api/orders`: Create order (validates stock, reduces inventory)
- **GET** `/api/orders`: List orders
- **GET** `/api/orders/{id}`: Order by id
- **GET** `/api/orders/number/{orderNumber}`: Order by order number
- **GET** `/api/orders/customer/{customerId}`: Orders by customer
- **GET** `/api/orders/status/{status}`: Orders by status
- **GET** `/api/orders/recent?limit=...`: Recent orders
- **GET** `/api/orders/date-range?start=...&end=...`: Orders in date range (ISO date-time)
- **PATCH** `/api/orders/{id}/status?status=...`: Update status
- **POST** `/api/orders/{id}/cancel`: Cancel order (restores stock if allowed)

### Files
- **POST** `/api/files/upload`: Upload a file (multipart)
- **GET** `/api/files/{fileName}`: Download/view a file
- **DELETE** `/api/files/{fileName}`: Delete a file

### 3D Models
- **POST** `/api/products/3d/{productId}/upload`: Upload `.glb` / `.gltf` model (Staff/Admin)
- **GET** `/api/products/3d/{productId}`: Get model URL
- **GET** `/api/products/3d/{productId}/check`: Check if a product has a model
- **DELETE** `/api/products/3d/{productId}`: Delete model (Admin)

### AI
- **POST** `/api/ai/product-finder`: AI-ranked product search (JWT required + rate-limited)
- **GET** `/api/test/gemini?message=...`: Gemini test endpoint

### API Docs
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## Screenshots / Demo

Add these before publishing:
- `docs/screenshots/home.png`
- `docs/screenshots/products.png`
- `docs/screenshots/product-detail-3d.png`
- `docs/screenshots/ai-product-finder.png`
- `docs/screenshots/admin-dashboard.png`
- `docs/screenshots/admin-products.png`

Demo video (optional): `docs/demo.mp4`

---

## Future Improvements

- **Real order UI integration**: wire `/admin/orders` to live backend data (currently UI uses mock order objects).
- **Cart + checkout flow**: persist cart, create orders from the frontend, payment gateway integration.
- **Hardened production configuration**
  - Move secrets to environment variables only
  - Add structured logging + tracing
  - Add request validation + standardized error responses across modules
- **AI enhancements**
  - Streaming responses
  - Better intent JSON schema + robust parsing
  - Hybrid search (DB filters + semantic embeddings)
  - Redis-backed rate limiting and caching for multi-instance deployments
- **3D/AR enhancements**
  - Admin UI to upload/manage 3D models
  - CDN-backed asset hosting for large `.glb` files
- **Testing**
  - Integration tests for controllers/services
  - Contract tests for frontend ↔ backend APIs

---

## Author / Credits

Built by **[Your Name]** as a software engineering portfolio project.

- **Backend**: Spring Boot API, JWT security, AI integration, data model and services
- **Frontend**: React storefront + admin dashboard UI

If you’d like, add:
- LinkedIn: `<your-link>`
- Portfolio: `<your-site>`

