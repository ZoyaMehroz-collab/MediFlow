# MEDIFLOW: Architectural Blueprint
## System Architecture & Technical Specifications

---

### 1. High-Level System Architecture

MEDIFLOW strictly adheres to a **Clean Layered Architecture** pattern, enforcing separation of concerns between presentation, business logic, data persistence, and custom algorithmic engines.

```mermaid
graph TB
    subgraph Client_Layer ["Client Layer (Frontend SPA)"]
        UI["React.js + Tailwind CSS UI"]
        Axios["Axios HTTP Client + Auth Interceptor"]
        Router["React Router v6 Guarded Routes"]
    end

    subgraph Security_Layer ["Security & Ingress Layer"]
        Gateway["CORS & Request Security Filter"]
        JWTFilter["JwtAuthenticationFilter"]
        SecConfig["Spring Security 6 Configuration"]
    end

    subgraph Controller_Layer ["Controller Layer (REST Endpoints)"]
        AuthCtrl["AuthController"]
        MedCtrl["MedicineController"]
        InvCtrl["InventoryController"]
        CartCtrl["CartController"]
        OrderCtrl["OrderController"]
        PresCtrl["PrescriptionController"]
        DelivCtrl["DeliveryController"]
    end

    subgraph Service_Layer ["Service Layer & DSA Engine"]
        AuthSvc["AuthService"]
        MedSvc["MedicineService"]
        InvSvc["InventoryService"]
        OrderSvc["OrderService"]
        DelivSvc["DeliveryService"]
        
        subgraph DSA_Engine ["Custom DSA Engine"]
            Trie["MedicineTrie (Autocomplete)"]
            MinHeapStock["InventoryMinHeap (Low Stock)"]
            MinHeapExpiry["ExpiryMinHeap (Earliest Expiry)"]
            GraphAlg["DeliveryGraph + Dijkstra (Shortest Route)"]
            MapIndex["HashMap Cache Index"]
        end
    end

    subgraph Persistence_Layer ["Persistence Layer"]
        Repo["Spring Data JPA Repositories"]
        Entities["JPA Entities / Hibernate ORM"]
        DB[(MySQL 8 / H2 Database)]
    end

    UI --> Router
    Router --> Axios
    Axios -->|HTTPS / JSON + JWT| Gateway
    Gateway --> JWTFilter
    JWTFilter --> SecConfig
    SecConfig --> Controller_Layer
    Controller_Layer -->|Requests / DTOs| Service_Layer
    Service_Layer <--> DSA_Engine
    Service_Layer -->|Domain Operations| Repo
    Repo -->|JPQL / SQL Queries| DB
```

---

### 2. Clean Layered Architecture Principles

```
HTTP Request
     │
     ▼
[ Controller Layer ]  ──> Validates DTOs (@Valid), maps request parameters, invokes services.
     │
     ▼
[ Service Layer ]     ──> Implements business rules, coordinates transaction boundaries (@Transactional),
     │                    integrates custom DSA engines (Trie, MinHeap, Dijkstra).
     ▼
[ Repository Layer ]  ──> Extends JpaRepository, handles database queries, custom JPQL/Native queries.
     │
     ▼
[ Database ]          ──> Stores normalized relational entities with foreign keys and indexes.
```

#### DTO & Entity Separation Rules:
1. **Entities** (`com.mediflow.entity.*`) never leak into Controller responses or Client request bodies. They are strictly confined to Service and Persistence layers.
2. **DTOs** (`com.mediflow.dto.*`) encapsulate request payloads (e.g., `LoginRequest`, `CreateOrderRequest`) and response views (e.g., `MedicineResponseDTO`, `OrderSummaryDTO`).
3. **Mappers** or builder patterns explicitly copy data between DTOs and Entities to maintain immutability and shield internal database structures.

---

### 3. Security Architecture (Spring Security 6 + JWT)

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant AuthCtrl as AuthController
    participant AuthManager as AuthenticationManager
    participant TokenProv as JwtTokenProvider
    participant Filter as JwtAuthenticationFilter
    participant ProtectedCtrl as Protected Controller

    User->>AuthCtrl: POST /api/v1/auth/login {email, password}
    AuthCtrl->>AuthManager: authenticate(UsernamePasswordAuthenticationToken)
    AuthManager-->>AuthCtrl: Authenticated Authentication object
    AuthCtrl->>TokenProv: generateToken(UserPrincipal)
    TokenProv-->>User: AuthResponse { token, tokenType: "Bearer", role, email }

    Note over User, ProtectedCtrl: Subsequent Protected API Request
    User->>Filter: GET /api/v1/orders (Header: Authorization: Bearer <token>)
    Filter->>TokenProv: validateToken(jwt)
    TokenProv-->>Filter: Valid Token & User Claims
    Filter->>Filter: SecurityContextHolder.getContext().setAuthentication(auth)
    Filter->>ProtectedCtrl: Pass request to Controller
    ProtectedCtrl-->>User: 200 OK Response Data
```

---

### 4. Codebase Directory Structure

#### A. Backend Package Structure (`mediflow-backend`)
```
mediflow-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── mediflow/
│   │   │           ├── MediflowApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── SwaggerConfig.java
│   │   │           │   └── WebConfig.java
│   │   │           ├── security/
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   ├── JwtAuthenticationEntryPoint.java
│   │   │           │   └── UserDetailsServiceImpl.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── MedicineController.java
│   │   │           │   ├── CategoryController.java
│   │   │           │   ├── InventoryController.java
│   │   │           │   ├── CartController.java
│   │   │           │   ├── OrderController.java
│   │   │           │   ├── PrescriptionController.java
│   │   │           │   ├── DeliveryController.java
│   │   │           │   ├── ReviewController.java
│   │   │           │   └── AnalyticsController.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── MedicineService.java
│   │   │           │   ├── CategoryService.java
│   │   │           │   ├── InventoryService.java
│   │   │           │   ├── CartService.java
│   │   │           │   ├── OrderService.java
│   │   │           │   ├── PrescriptionService.java
│   │   │           │   ├── DeliveryService.java
│   │   │           │   └── ReviewService.java
│   │   │           ├── dsa/
│   │   │           │   ├── trie/
│   │   │           │   │   ├── TrieNode.java
│   │   │           │   │   └── MedicineTrie.java
│   │   │           │   ├── heap/
│   │   │           │   │   ├── InventoryMinHeap.java
│   │   │           │   │   └── ExpiryMinHeap.java
│   │   │           │   ├── graph/
│   │   │           │   │   ├── GraphNode.java
│   │   │           │   │   ├── GraphEdge.java
│   │   │           │   │   ├── DeliveryGraph.java
│   │   │           │   │   └── DijkstraShortestPath.java
│   │   │           │   └── cache/
│   │   │           │       └── MedicineCacheMap.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── RoleRepository.java
│   │   │           │   ├── MedicineRepository.java
│   │   │           │   ├── CategoryRepository.java
│   │   │           │   ├── InventoryRepository.java
│   │   │           │   ├── CartRepository.java
│   │   │           │   ├── OrderRepository.java
│   │   │           │   ├── AddressRepository.java
│   │   │           │   ├── PrescriptionRepository.java
│   │   │           │   ├── ReviewRepository.java
│   │   │           │   └── DeliveryRepository.java
│   │   │           ├── entity/
│   │   │           │   ├── User.java
│   │   │           │   ├── Role.java
│   │   │           │   ├── Medicine.java
│   │   │           │   ├── Category.java
│   │   │           │   ├── Inventory.java
│   │   │           │   ├── Cart.java
│   │   │           │   ├── CartItem.java
│   │   │           │   ├── Order.java
│   │   │           │   ├── OrderItem.java
│   │   │           │   ├── Address.java
│   │   │           │   ├── Prescription.java
│   │   │           │   ├── Review.java
│   │   │           │   └── Delivery.java
│   │   │           ├── dto/
│   │   │           │   ├── request/...
│   │   │           │   └── response/...
│   │   │           └── exception/
│   │   │               ├── GlobalExceptionHandler.java
│   │   │               ├── ResourceNotFoundException.java
│   │   │               ├── BadRequestException.java
│   │   │               └── UnauthorizedException.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── data.sql
│   └── test/
│       └── java/
│           └── com/
│               └── mediflow/
│                   ├── dsa/
│                   │   ├── MedicineTrieTest.java
│                   │   ├── MinHeapTest.java
│                   │   └── DijkstraTest.java
│                   └── service/
│                       └── MedicineServiceTest.java
```

#### B. Frontend Directory Structure (`mediflow-frontend`)
```
mediflow-frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   ├── axiosClient.js
    │   ├── authApi.js
    │   ├── medicineApi.js
    │   ├── cartApi.js
    │   ├── orderApi.js
    │   ├── prescriptionApi.js
    │   ├── adminApi.js
    │   └── deliveryApi.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── Toast.jsx
    │   ├── customer/
    │   │   ├── AutocompleteSearch.jsx
    │   │   ├── MedicineCard.jsx
    │   │   ├── CartDrawer.jsx
    │   │   └── PrescriptionUploader.jsx
    │   ├── admin/
    │   │   ├── StatCard.jsx
    │   │   ├── InventoryAlertTable.jsx
    │   │   └── ExpiryAlertTable.jsx
    │   └── delivery/
    │       └── RouteMapVisualizer.jsx
    ├── pages/
    │   ├── customer/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── MedicinesPage.jsx
    │   │   ├── MedicineDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   ├── PrescriptionsPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminMedicinesPage.jsx
    │   │   ├── AdminInventoryPage.jsx
    │   │   ├── AdminOrdersPage.jsx
    │   │   ├── AdminPrescriptionsPage.jsx
    │   │   ├── AdminCustomersPage.jsx
    │   │   ├── AdminDeliveryPage.jsx
    │   │   └── AdminAnalyticsPage.jsx
    │   └── delivery/
    │       ├── DeliveryDashboard.jsx
    │       ├── DeliveryOrdersPage.jsx
    │       └── DeliveryDetailPage.jsx
    └── routes/
        ├── AppRoutes.jsx
        └── ProtectedRoute.jsx
```
