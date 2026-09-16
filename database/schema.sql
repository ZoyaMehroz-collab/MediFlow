-- ============================================================
-- MEDIFLOW SMART PHARMACY MANAGEMENT PLATFORM
-- Database Schema - MySQL 8 Compatible
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(120) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            ENUM('ROLE_CUSTOMER','ROLE_PHARMACY_ADMIN','ROLE_DELIVERY_AGENT') NOT NULL DEFAULT 'ROLE_CUSTOMER',
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. CATEGORIES TABLE
-- ============================================================
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon_name   VARCHAR(50),
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_categories_name   (name),
    INDEX idx_categories_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. MEDICINES TABLE
-- ============================================================
CREATE TABLE medicines (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id           BIGINT NOT NULL,
    name                  VARCHAR(150) NOT NULL,
    generic_name          VARCHAR(150),
    manufacturer          VARCHAR(100),
    dosage_form           VARCHAR(50),
    strength              VARCHAR(50),
    unit_price            DECIMAL(10,2) NOT NULL,
    prescription_required BOOLEAN NOT NULL DEFAULT FALSE,
    description           TEXT,
    image_url             VARCHAR(500),
    active                BOOLEAN NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medicines_category FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_medicines_name      (name),
    INDEX idx_medicines_category  (category_id),
    INDEX idx_medicines_active    (active),
    FULLTEXT INDEX ft_medicines_search (name, generic_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. INVENTORY TABLE (Batch-level stock tracking)
-- ============================================================
CREATE TABLE inventory (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id    BIGINT NOT NULL,
    batch_number   VARCHAR(50) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level  INT NOT NULL DEFAULT 10,
    expiry_date    DATE NOT NULL,
    status         ENUM('IN_STOCK','LOW_STOCK','OUT_OF_STOCK','EXPIRED') NOT NULL DEFAULT 'IN_STOCK',
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    INDEX idx_inventory_medicine     (medicine_id),
    INDEX idx_inventory_stock        (stock_quantity),
    INDEX idx_inventory_expiry       (expiry_date),
    INDEX idx_inventory_status       (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. ADDRESSES TABLE
-- ============================================================
CREATE TABLE addresses (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL,
    recipient_name   VARCHAR(100) NOT NULL,
    phone            VARCHAR(20) NOT NULL,
    street_address   VARCHAR(255) NOT NULL,
    city             VARCHAR(80) NOT NULL,
    state            VARCHAR(80) NOT NULL,
    postal_code      VARCHAR(20) NOT NULL,
    graph_node_id    INT NOT NULL DEFAULT 6,
    is_default       BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. PRESCRIPTIONS TABLE
-- ============================================================
CREATE TABLE prescriptions (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id       BIGINT NOT NULL,
    file_path         VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    status            ENUM('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
    admin_notes       VARCHAR(255),
    uploaded_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prescriptions_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    INDEX idx_prescriptions_customer (customer_id),
    INDEX idx_prescriptions_status   (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. CARTS TABLE
-- ============================================================
CREATE TABLE carts (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. CART_ITEMS TABLE
-- ============================================================
CREATE TABLE cart_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id     BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cart_items_cart     FOREIGN KEY (cart_id)     REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    INDEX idx_cart_items_cart (cart_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number        VARCHAR(40) NOT NULL UNIQUE,
    customer_id         BIGINT NOT NULL,
    total_amount        DECIMAL(10,2) NOT NULL,
    order_status        ENUM('PLACED','VERIFIED','PROCESSING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PLACED',
    payment_status      ENUM('PENDING','PAID','FAILED') NOT NULL DEFAULT 'PENDING',
    shipping_address_id BIGINT NOT NULL,
    prescription_id     BIGINT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer    FOREIGN KEY (customer_id)         REFERENCES users(id),
    CONSTRAINT fk_orders_address     FOREIGN KEY (shipping_address_id) REFERENCES addresses(id),
    CONSTRAINT fk_orders_prescription FOREIGN KEY (prescription_id)    REFERENCES prescriptions(id),
    INDEX idx_orders_customer     (customer_id),
    INDEX idx_orders_status       (order_status),
    INDEX idx_orders_created      (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. ORDER_ITEMS TABLE
-- ============================================================
CREATE TABLE order_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    quantity    INT NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    subtotal    DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)    REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. REVIEWS TABLE
-- ============================================================
CREATE TABLE reviews (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    CONSTRAINT fk_reviews_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    INDEX idx_reviews_medicine (medicine_id),
    INDEX idx_reviews_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. DELIVERIES TABLE
-- ============================================================
CREATE TABLE deliveries (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT NOT NULL UNIQUE,
    delivery_agent_id   BIGINT,
    status              ENUM('ASSIGNED','PICKED_UP','IN_TRANSIT','DELIVERED','FAILED') NOT NULL DEFAULT 'ASSIGNED',
    optimal_route_nodes VARCHAR(255),
    total_distance_km   DECIMAL(6,2),
    estimated_time_mins INT,
    assigned_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    picked_up_at        TIMESTAMP NULL,
    delivered_at        TIMESTAMP NULL,
    CONSTRAINT fk_deliveries_order FOREIGN KEY (order_id)          REFERENCES orders(id),
    CONSTRAINT fk_deliveries_agent FOREIGN KEY (delivery_agent_id) REFERENCES users(id),
    INDEX idx_deliveries_agent  (delivery_agent_id),
    INDEX idx_deliveries_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
