# MEDIFLOW: RESTful API Specification
## OpenAPI 3.0 Standard Endpoint Documentation

---

### 1. General API Information

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: `Authorization: Bearer <JWT_TOKEN>` header for protected routes.
- **Global Error Format**:
  ```json
  {
    "timestamp": "2026-08-09T01:00:00.000+00:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed for request parameters",
    "path": "/api/v1/medicines",
    "details": ["name must not be blank", "unitPrice must be greater than 0"]
  }
  ```

---

### 2. Authentication & User Management (`/api/v1/auth`)

#### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "Password123!",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER" // CUSTOMER, PHARMACY_ADMIN, DELIVERY_AGENT
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "customer@example.com",
    "fullName": "John Doe",
    "role": "ROLE_CUSTOMER"
  }
  ```

#### 2. User Login
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**: Same token response payload.

#### 3. Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/v1/auth/me`
- **Access**: Authenticated (`CUSTOMER`, `PHARMACY_ADMIN`, `DELIVERY_AGENT`)

---

### 3. Medicine & Autocomplete APIs (`/api/v1/medicines`)

#### 1. Search Medicine Autocomplete (Trie Algorithm Engine)
- **Method**: `GET`
- **Endpoint**: `/api/v1/medicines/autocomplete?query=para`
- **Access**: Public
- **Description**: Invokes internal Trie data structure to return instantaneous prefix matching suggestions.
- **Response (200 OK)**:
  ```json
  {
    "query": "para",
    "matchCount": 3,
    "suggestions": [
      { "id": 101, "name": "Paracetamol 500mg", "dosageForm": "Tablet", "unitPrice": 12.50 },
      { "id": 102, "name": "Paracetamol 650mg", "dosageForm": "Tablet", "unitPrice": 15.00 },
      { "id": 103, "name": "Paracetamol Syrup 100ml", "dosageForm": "Syrup", "unitPrice": 45.00 }
    ]
  }
  ```

#### 2. Browse & Filter Medicines
- **Method**: `GET`
- **Endpoint**: `/api/v1/medicines?categoryId=1&search=para&sortBy=priceAsc&page=0&size=10`
- **Access**: Public

#### 3. Get Medicine Details
- **Method**: `GET`
- **Endpoint**: `/api/v1/medicines/{id}`
- **Access**: Public

#### 4. Add New Medicine
- **Method**: `POST`
- **Endpoint**: `/api/v1/medicines`
- **Access**: Admin Only (`ROLE_PHARMACY_ADMIN`)

---

### 4. Inventory Management APIs (`/api/v1/admin/inventory`)

#### 1. Critical Low-Stock Prioritized Inventory (Min-Heap Algorithm Engine)
- **Method**: `GET`
- **Endpoint**: `/api/v1/admin/inventory/low-stock?threshold=15`
- **Access**: Admin Only (`ROLE_PHARMACY_ADMIN`)
- **Description**: Uses internal `InventoryMinHeap` to extract items with stock below threshold in $O(K \log N)$ time.
- **Response (200 OK)**:
  ```json
  [
    { "batchId": 501, "medicineName": "Insulin Glargine 100IU", "stockQuantity": 3, "reorderLevel": 10, "status": "CRITICAL" },
    { "batchId": 502, "medicineName": "Cetirizine 10mg", "stockQuantity": 7, "reorderLevel": 15, "status": "LOW_STOCK" },
    { "batchId": 503, "medicineName": "Azithromycin 500mg", "stockQuantity": 12, "reorderLevel": 20, "status": "LOW_STOCK" }
  ]
  ```

#### 2. Earliest Expiry Prioritized Inventory (Expiry Priority Queue)
- **Method**: `GET`
- **Endpoint**: `/api/v1/admin/inventory/expiring-soon?daysLimit=90`
- **Access**: Admin Only (`ROLE_PHARMACY_ADMIN`)
- **Description**: Uses `ExpiryMinHeap` to return batches expiring within specified day threshold.

---

### 5. Shopping Cart APIs (`/api/v1/cart`)

- `GET /api/v1/cart`: Fetch user's cart and itemized breakdown.
- `POST /api/v1/cart/items`: Add medicine to cart (`{ medicineId, quantity }`).
- `PUT /api/v1/cart/items/{itemId}`: Update item quantity.
- `DELETE /api/v1/cart/items/{itemId}`: Remove item from cart.
- `DELETE /api/v1/cart`: Clear entire cart.

---

### 6. Order Placement & Tracking APIs (`/api/v1/orders`)

#### 1. Place Order (Checkout)
- **Method**: `POST`
- **Endpoint**: `/api/v1/orders/checkout`
- **Access**: Customer Only (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "shippingAddressId": 5,
    "prescriptionId": 12, // Optional if no rx items
    "paymentMethod": "CREDIT_CARD"
  }
  ```

#### 2. Get User Order History
- **Method**: `GET`
- **Endpoint**: `/api/v1/orders`
- **Access**: Customer / Admin

#### 3. Update Order Status
- **Method**: `PUT`
- **Endpoint**: `/api/v1/admin/orders/{id}/status`
- **Access**: Admin Only (`ROLE_PHARMACY_ADMIN`)

---

### 7. Prescription System APIs (`/api/v1/prescriptions`)

- `POST /api/v1/prescriptions/upload`: Multipart file upload for rx image/PDF.
- `GET /api/v1/prescriptions`: Fetch user uploaded prescriptions.
- `PUT /api/v1/admin/prescriptions/{id}/verify`: Verify or reject prescription (`{ status: "VERIFIED", notes: "Approved by Dr. Smith" }`).

---

### 8. Delivery Route Optimization APIs (`/api/v1/delivery`)

#### 1. Calculate & Assign Optimal Delivery Route (Dijkstra Shortest Path Engine)
- **Method**: `POST`
- **Endpoint**: `/api/v1/admin/delivery/assign`
- **Access**: Admin Only (`ROLE_PHARMACY_ADMIN`)
- **Request Body**:
  ```json
  {
    "orderId": 1001,
    "deliveryAgentId": 8,
    "startHubNodeId": 1 // Central Pharmacy Hub
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "deliveryId": 801,
    "orderId": 1001,
    "agentName": "David Miller",
    "destinationAddressNode": 12,
    "optimalPathNodes": ["Hub Node 1", "Distribution Point 3", "Sector 7 Junction", "Customer Residence 12"],
    "totalDistanceKm": 8.4,
    "estimatedTimeMins": 18,
    "status": "ASSIGNED"
  }
  ```

#### 2. Agent Delivery Status Update
- **Method**: `PUT`
- **Endpoint**: `/api/v1/delivery/{id}/status`
- **Access**: Delivery Agent Only (`ROLE_DELIVERY_AGENT`)
- **Request Body**: `{ "status": "DELIVERED" }` // PICKED_UP, IN_TRANSIT, DELIVERED
