# 🏥 MediFlow — Smart Pharmacy & Medicine Delivery System

![Java](https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**MediFlow** is a full-stack, enterprise-grade digital pharmacy and medicine delivery platform. It seamlessly connects customers, pharmacists/admins, and delivery agents while utilizing graph-based route optimization for efficient order fulfillment.

---

## ✨ Key Features

### 🛒 Customer Portal
- **Medicine Directory & Search**: Browse & filter medicines by category, strength, dosage form, and prescription requirements.
- **Interactive Delivery Route Map**: Visualizes delivery routes in real-time using **Dijkstra's Shortest Path Algorithm** on an interactive SVG graph.
- **Medication & Refill Reminders**: Track daily dosage schedules, set recurring reminders, and receive refill alerts.
- **Prescription Upload**: Upload digital prescriptions for verification by licensed pharmacists before order confirmation.
- **Cart & Checkout**: Multi-step checkout process with real-time price calculation and delivery address management.

### 👨‍⚕️ Admin & Pharmacist Dashboard
- **Analytics & Overview**: Revenue metrics, total orders, pending prescription verification counts, and stock alerts.
- **Inventory Management**: Add, edit, disable, or adjust stock levels and prices for medicines.
- **Order Management**: Review customer orders, update fulfillment statuses (`PENDING`, `PROCESSING`, `OUT_FOR_DELIVERY`, `DELIVERED`).
- **Prescription Verification**: Verify uploaded prescription images against pending customer orders.

### 🚚 Delivery Agent Portal
- Active assignment dashboard with step-by-step route visualization and status update controls.

### 🔐 Security & Auth
- **JWT Authentication**: Stateless token authentication with role-based access control (`ROLE_CUSTOMER`, `ROLE_ADMIN`, `ROLE_DELIVERY`).
- **Data Protection**: Encrypted user credentials using BCrypt.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Java 17, Spring Boot 3.2, Spring Security |
| **Persistence & Database** | Spring Data JPA, Hibernate, H2 (In-Memory) / PostgreSQL |
| **Security & Auth** | JSON Web Tokens (JWT), BCrypt Hashing |
| **Frontend Framework** | React 18 (Hooks, Context API), Vite |
| **Styling & Icons** | Tailwind CSS, Lucide React Icons |
| **Algorithms** | Dijkstra's Shortest Path (Graph Theory for Route Optimization) |
| **Build Tools** | Apache Maven, npm |

---

## 📁 Project Architecture

```
mediflow/
├── mediflow-backend/          # Spring Boot REST API
│   ├── src/main/java/com/mediflow/
│   │   ├── config/            # Security & CORS configuration
│   │   ├── controller/        # REST Endpoints (Auth, Medicine, Order, etc.)
│   │   ├── dto/               # Request & Response Data Transfer Objects
│   │   ├── entity/            # JPA Data Entities
│   │   ├── repository/        # Data Repositories
│   │   ├── security/          # JWT Filters & UserDetails Service
│   │   └── service/           # Business Logic Layer
│   └── src/main/resources/    # Application configuration (application.yml)
│
├── mediflow-frontend/         # React SPA (Vite)
│   ├── src/
│   │   ├── api/               # Axios API client & interceptors
│   │   ├── components/        # Reusable UI components & Navigation
│   │   │   └── common/        # DeliveryMapVisualizer, Sidebar, Navbar
│   │   ├── context/           # AuthContext & CartContext
│   │   ├── pages/             # Customer, Admin, Delivery & Public Pages
│   │   └── App.jsx            # Main Router & Route Guards
│   └── vite.config.js
│
├── database/                  # SQL Schema & Seed Scripts
├── ARCHITECTURE.md            # System Architecture & Component Interactions
├── API_SPECIFICATION.md       # Complete REST API Documentation
└── DSA_DESIGN.md              # Data Structures & Algorithm Design Document
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Java JDK 17** or higher
- **Node.js** (v18.x or higher) & **npm**
- **Maven 3.8+** (or use the included Maven wrapper)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ZoyaMehroz-collab/MediFlow.git
cd MediFlow
```

---

### 2️⃣ Run the Backend (Spring Boot)

```bash
cd mediflow-backend
mvn spring-boot:run
```
> The backend server will start at: `http://localhost:8080`
> H2 Database Console available at: `http://localhost:8080/h2-console`

---

### 3️⃣ Run the Frontend (React + Vite)

Open a new terminal window:
```bash
cd mediflow-frontend
npm install
npm run dev
```
> The React web app will open at: `http://localhost:3000`

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | ❌ No |
| `GET` | `/api/medicines` | Fetch paginated catalog | ❌ No |
| `GET` | `/api/medicines/{id}` | Get medicine details | ❌ No |
| `GET` | `/api/orders` | Fetch user order history | 🔒 Yes |
| `POST` | `/api/orders` | Place a new order | 🔒 Yes |
| `POST` | `/api/prescriptions/upload` | Upload digital prescription | 🔒 Yes |
| `GET` | `/api/admin/dashboard` | Fetch store performance summary | 🔒 Admin |

---

## 📄 Documentation

Detailed architecture specifications are available in the repository root:
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — High-level design & component relationships.
- [`API_SPECIFICATION.md`](API_SPECIFICATION.md) — Exhaustive REST API contract.
- [`DSA_DESIGN.md`](DSA_DESIGN.md) — Graph structure and Dijkstra shortest path implementation.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
