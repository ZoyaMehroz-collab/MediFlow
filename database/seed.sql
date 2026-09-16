-- ============================================================
-- MEDIFLOW SMART PHARMACY - DEMO SEED DATA
-- Realistic sample data for development and demonstration
-- ============================================================

-- ============================================================
-- CATEGORIES (8 pharmaceutical categories)
-- ============================================================
INSERT INTO categories (name, description, icon_name) VALUES
('Antibiotics',        'Medicines that fight bacterial infections',                  'shield-virus'),
('Analgesics',         'Pain relief and fever reduction medicines',                  'thermometer'),
('Antidiabetics',      'Medicines for managing diabetes and blood sugar levels',     'droplet'),
('Cardiovascular',     'Heart and blood pressure medicines',                         'heart-pulse'),
('Vitamins & Supplements', 'Nutritional supplements and vitamins',                  'capsules'),
('Antihistamines',     'Allergy relief and antihistamine medicines',                 'leaf'),
('Gastrointestinal',   'Medicines for digestive system health',                      'stomach'),
('Dermatology',        'Skin care and topical treatment medicines',                  'skin');

-- ============================================================
-- USERS (Hashed passwords use BCrypt - all passwords = "Password123!")
-- ============================================================
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
-- Admin
('admin@mediflow.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'Dr. Sarah Mitchell',    '+1-555-0101', 'ROLE_PHARMACY_ADMIN'),
-- Delivery Agents
('agent1@mediflow.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'David Wilson',          '+1-555-0201', 'ROLE_DELIVERY_AGENT'),
('agent2@mediflow.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'Marcus Thompson',       '+1-555-0202', 'ROLE_DELIVERY_AGENT'),
-- Customers
('john.doe@email.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'John Doe',              '+1-555-0301', 'ROLE_CUSTOMER'),
('jane.smith@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'Jane Smith',            '+1-555-0302', 'ROLE_CUSTOMER'),
('alex.kumar@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'Alex Kumar',            '+1-555-0303', 'ROLE_CUSTOMER'),
('emily.chen@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'Emily Chen',            '+1-555-0304', 'ROLE_CUSTOMER'),
('ryan.jones@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7S', 'Ryan Jones',            '+1-555-0305', 'ROLE_CUSTOMER');

-- ============================================================
-- MEDICINES (30+ medicines across all categories)
-- ============================================================

-- Category 1: Antibiotics (category_id = 1)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(1, 'Amoxicillin 500mg Capsules',    'Amoxicillin',     'PharmaCo Labs',     'Capsule', '500mg',    45.50, TRUE,  'Broad-spectrum penicillin antibiotic for bacterial infections'),
(1, 'Azithromycin 250mg Tablets',    'Azithromycin',    'MediGen Inc.',      'Tablet',  '250mg',    78.00, TRUE,  'Macrolide antibiotic used to treat respiratory infections'),
(1, 'Ciprofloxacin 500mg Tablets',   'Ciprofloxacin',   'HealthPharm',       'Tablet',  '500mg',    55.75, TRUE,  'Fluoroquinolone antibiotic for urinary tract infections'),
(1, 'Doxycycline 100mg Capsules',    'Doxycycline',     'BioSynth Corp',     'Capsule', '100mg',    38.25, TRUE,  'Tetracycline antibiotic for acne and respiratory infections'),
(1, 'Metronidazole 400mg Tablets',   'Metronidazole',   'PharmaCo Labs',     'Tablet',  '400mg',    32.00, TRUE,  'Antibiotic and antiprotozoal agent for anaerobic infections');

-- Category 2: Analgesics (category_id = 2)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(2, 'Paracetamol 500mg Tablets',     'Paracetamol',     'GenMed',            'Tablet',  '500mg',    12.50, FALSE, 'Common analgesic and antipyretic for pain and fever relief'),
(2, 'Paracetamol 650mg Tablets',     'Paracetamol',     'GenMed',            'Tablet',  '650mg',    15.00, FALSE, 'Extended release paracetamol for prolonged pain management'),
(2, 'Paracetamol Syrup 120ml',       'Paracetamol',     'GenMed',            'Syrup',   '125mg/5ml',45.00, FALSE, 'Paracetamol liquid formulation suitable for children'),
(2, 'Ibuprofen 400mg Tablets',       'Ibuprofen',       'HealthPharm',       'Tablet',  '400mg',    22.00, FALSE, 'NSAID for pain, inflammation, and fever reduction'),
(2, 'Tramadol 50mg Capsules',        'Tramadol HCl',    'PharmaCo Labs',     'Capsule', '50mg',     68.50, TRUE,  'Opioid analgesic for moderate to severe pain'),
(2, 'Diclofenac 75mg Injection',     'Diclofenac',      'BioSynth Corp',     'Injection','75mg/3ml', 95.00, TRUE,  'NSAID injection for acute pain management');

-- Category 3: Antidiabetics (category_id = 3)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(3, 'Metformin 500mg Tablets',       'Metformin HCl',   'DiaCare Pharma',    'Tablet',  '500mg',    28.00, TRUE,  'First-line oral antidiabetic for Type 2 diabetes management'),
(3, 'Metformin 1000mg Tablets',      'Metformin HCl',   'DiaCare Pharma',    'Tablet',  '1000mg',   42.00, TRUE,  'Higher dose metformin for better glycemic control'),
(3, 'Glipizide 5mg Tablets',         'Glipizide',       'MediGen Inc.',      'Tablet',  '5mg',      35.50, TRUE,  'Sulfonylurea for stimulating insulin production'),
(3, 'Insulin Glargine 100IU/ml',     'Insulin Glargine','InsulinCare Ltd',   'Injection','100IU/ml', 285.00, TRUE, 'Long-acting basal insulin analog for diabetes management'),
(3, 'Sitagliptin 100mg Tablets',     'Sitagliptin',     'DiaCare Pharma',    'Tablet',  '100mg',    195.00, TRUE, 'DPP-4 inhibitor for Type 2 diabetes');

-- Category 4: Cardiovascular (category_id = 4)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(4, 'Amlodipine 5mg Tablets',        'Amlodipine',      'CardioPharm',       'Tablet',  '5mg',      32.50, TRUE,  'Calcium channel blocker for hypertension and angina'),
(4, 'Atorvastatin 20mg Tablets',     'Atorvastatin',    'LipidControl Inc.', 'Tablet',  '20mg',     65.00, TRUE,  'Statin for reducing cholesterol and cardiovascular risk'),
(4, 'Ramipril 5mg Capsules',         'Ramipril',        'CardioPharm',       'Capsule', '5mg',      48.75, TRUE,  'ACE inhibitor for hypertension and heart failure'),
(4, 'Metoprolol 50mg Tablets',       'Metoprolol',      'HealthPharm',       'Tablet',  '50mg',     38.00, TRUE,  'Beta-blocker for high blood pressure and heart conditions'),
(4, 'Aspirin 75mg Tablets',          'Aspirin',         'GenMed',            'Tablet',  '75mg',     18.00, FALSE, 'Low-dose aspirin for antiplatelet therapy');

-- Category 5: Vitamins & Supplements (category_id = 5)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(5, 'Vitamin D3 60000IU Capsules',   'Cholecalciferol', 'NutriHealth',       'Capsule', '60000IU',  85.00, FALSE, 'Weekly vitamin D3 supplement for bone and immune health'),
(5, 'Vitamin B12 500mcg Tablets',    'Cyanocobalamin',  'NutriHealth',       'Tablet',  '500mcg',   45.00, FALSE, 'Vitamin B12 supplement for nerve and blood cell health'),
(5, 'Zinc 10mg Tablets',             'Zinc Gluconate',  'VitaPack Corp',     'Tablet',  '10mg',     25.00, FALSE, 'Zinc supplement for immune support and wound healing'),
(5, 'Omega-3 Fish Oil 1000mg',       'Omega-3 EPA/DHA', 'NutriHealth',       'Capsule', '1000mg',   120.00, FALSE,'Essential omega-3 fatty acids for heart and brain health');

-- Category 6: Antihistamines (category_id = 6)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(6, 'Cetirizine 10mg Tablets',       'Cetirizine HCl',  'AllergyFree',       'Tablet',  '10mg',     22.50, FALSE, 'Non-drowsy antihistamine for allergy relief'),
(6, 'Loratadine 10mg Tablets',       'Loratadine',      'AllergyFree',       'Tablet',  '10mg',     28.00, FALSE, 'Long-acting antihistamine for hay fever and urticaria'),
(6, 'Fexofenadine 120mg Tablets',    'Fexofenadine',    'MediGen Inc.',      'Tablet',  '120mg',    55.00, FALSE, 'Non-sedating antihistamine for seasonal allergies'),
(6, 'Montelukast 10mg Tablets',      'Montelukast',     'AllergyFree',       'Tablet',  '10mg',     75.00, TRUE,  'Leukotriene receptor antagonist for asthma and allergies');

-- Category 7: Gastrointestinal (category_id = 7)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(7, 'Omeprazole 20mg Capsules',      'Omeprazole',      'GastroMed',         'Capsule', '20mg',     42.00, FALSE, 'Proton pump inhibitor for acid reflux and GERD treatment'),
(7, 'Pantoprazole 40mg Tablets',     'Pantoprazole',    'GastroMed',         'Tablet',  '40mg',     58.00, TRUE,  'PPI for erosive esophagitis and Zollinger-Ellison syndrome'),
(7, 'Domperidone 10mg Tablets',      'Domperidone',     'HealthPharm',       'Tablet',  '10mg',     18.50, FALSE, 'Antiemetic for nausea, vomiting, and delayed gastric emptying'),
(7, 'Ondansetron 4mg Tablets',       'Ondansetron HCl', 'PharmaCo Labs',     'Tablet',  '4mg',      65.00, TRUE,  '5-HT3 antagonist for chemotherapy-induced nausea');

-- Category 8: Dermatology (category_id = 8)
INSERT INTO medicines (category_id, name, generic_name, manufacturer, dosage_form, strength, unit_price, prescription_required, description) VALUES
(8, 'Clotrimazole 1% Cream 30g',     'Clotrimazole',    'DermaCare',         'Cream',   '1%',       85.00, FALSE, 'Antifungal cream for athlete''s foot and ringworm'),
(8, 'Hydrocortisone 1% Cream 30g',   'Hydrocortisone',  'DermaCare',         'Cream',   '1%',       65.00, FALSE, 'Mild corticosteroid cream for eczema and skin inflammation'),
(8, 'Retinol 0.025% Cream 20g',      'Tretinoin',       'SkinScience Ltd',   'Cream',   '0.025%',   145.00, TRUE, 'Vitamin A derivative for acne and anti-aging treatment');

-- ============================================================
-- INVENTORY (seed with varied stock levels and expiry dates)
-- ============================================================
INSERT INTO inventory (medicine_id, batch_number, stock_quantity, reorder_level, expiry_date, status) VALUES
-- Antibiotics
(1,  'AMX-2024-001', 85,  20, '2026-08-15', 'IN_STOCK'),
(2,  'AZI-2024-001', 7,   15, '2026-11-30', 'LOW_STOCK'),
(3,  'CIP-2024-001', 120, 25, '2027-03-31', 'IN_STOCK'),
(4,  'DOX-2024-001', 45,  10, '2026-09-20', 'IN_STOCK'),
(5,  'MET-2024-001', 60,  20, '2026-12-31', 'IN_STOCK'),
-- Analgesics
(6,  'PAR-2024-001', 350, 50, '2027-06-30', 'IN_STOCK'),
(7,  'PAR-2024-002', 180, 30, '2027-01-31', 'IN_STOCK'),
(8,  'PAR-2024-003', 95,  20, '2026-10-15', 'IN_STOCK'),
(9,  'IBU-2024-001', 220, 40, '2027-04-30', 'IN_STOCK'),
(10, 'TRA-2024-001', 4,   10, '2026-08-30', 'LOW_STOCK'),
(11, 'DIC-2024-001', 12,  15, '2026-09-30', 'LOW_STOCK'),
-- Antidiabetics
(12, 'MTF-2024-001', 145, 30, '2027-05-31', 'IN_STOCK'),
(13, 'MTF-2024-002', 88,  20, '2026-12-15', 'IN_STOCK'),
(14, 'GLP-2024-001', 55,  15, '2027-02-28', 'IN_STOCK'),
(15, 'INS-2024-001', 3,   10, '2026-08-20', 'LOW_STOCK'),
(16, 'SIT-2024-001', 22,  10, '2027-07-31', 'IN_STOCK'),
-- Cardiovascular
(17, 'AML-2024-001', 167, 30, '2027-08-31', 'IN_STOCK'),
(18, 'ATO-2024-001', 98,  20, '2027-01-15', 'IN_STOCK'),
(19, 'RAM-2024-001', 74,  15, '2026-11-30', 'IN_STOCK'),
(20, 'MPR-2024-001', 110, 25, '2026-10-31', 'IN_STOCK'),
(21, 'ASP-2024-001', 500, 80, '2027-12-31', 'IN_STOCK'),
-- Vitamins
(22, 'VD3-2024-001', 200, 40, '2027-09-30', 'IN_STOCK'),
(23, 'VB12-2024-001',175, 35, '2027-06-30', 'IN_STOCK'),
(24, 'ZNC-2024-001', 290, 50, '2027-10-31', 'IN_STOCK'),
(25, 'OMG-2024-001', 88,  20, '2026-12-20', 'IN_STOCK'),
-- Antihistamines
(26, 'CET-2024-001', 9,   20, '2026-09-15', 'LOW_STOCK'),
(27, 'LOR-2024-001', 155, 30, '2027-04-30', 'IN_STOCK'),
(28, 'FEX-2024-001', 67,  15, '2027-03-15', 'IN_STOCK'),
(29, 'MON-2024-001', 35,  10, '2026-11-20', 'IN_STOCK'),
-- Gastrointestinal
(30, 'OMP-2024-001', 198, 40, '2027-05-31', 'IN_STOCK'),
(31, 'PAN-2024-001', 112, 25, '2027-02-28', 'IN_STOCK'),
(32, 'DOM-2024-001', 88,  20, '2026-10-20', 'IN_STOCK'),
(33, 'OND-2024-001', 15,  10, '2026-08-25', 'LOW_STOCK'),
-- Dermatology
(34, 'CLO-2024-001', 76,  15, '2027-07-31', 'IN_STOCK'),
(35, 'HYD-2024-001', 54,  12, '2026-09-30', 'IN_STOCK'),
(36, 'RET-2024-001', 0,   5,  '2027-01-31', 'OUT_OF_STOCK');

-- ============================================================
-- ADDRESSES
-- ============================================================
INSERT INTO addresses (user_id, recipient_name, phone, street_address, city, state, postal_code, graph_node_id, is_default) VALUES
(4, 'John Doe',   '+1-555-0301', '42 Maple Street, Apt 3B', 'Springfield', 'Illinois',   '62701', 6,  TRUE),
(5, 'Jane Smith', '+1-555-0302', '17 Oak Avenue',           'Riverdale',   'New York',   '10471', 7,  TRUE),
(6, 'Alex Kumar', '+1-555-0303', '88 Palm Drive, Suite 12', 'Sunnyvale',   'California', '94086', 8,  TRUE),
(7, 'Emily Chen', '+1-555-0304', '5 Birchwood Lane',        'Austin',      'Texas',      '73301', 9,  TRUE),
(8, 'Ryan Jones', '+1-555-0305', '23 Cedar Court',          'Lakewood',    'Colorado',   '80401', 10, TRUE);

-- ============================================================
-- PRESCRIPTIONS
-- ============================================================
INSERT INTO prescriptions (customer_id, file_path, original_filename, status, admin_notes) VALUES
(4, 'uploads/prescriptions/rx-john-doe-001.pdf',   'prescription_john.pdf',  'VERIFIED', 'Approved - insulin prescription valid for 6 months'),
(5, 'uploads/prescriptions/rx-jane-smith-001.pdf', 'prescription_jane.pdf',  'PENDING',  NULL),
(6, 'uploads/prescriptions/rx-alex-kumar-001.pdf', 'prescription_alex.pdf',  'VERIFIED', 'Antibiotic prescription verified'),
(7, 'uploads/prescriptions/rx-emily-chen-001.pdf', 'prescription_emily.pdf', 'REJECTED', 'Prescription appears to be expired');

-- ============================================================
-- ORDERS
-- ============================================================
INSERT INTO orders (order_number, customer_id, total_amount, order_status, payment_status, shipping_address_id, prescription_id) VALUES
('MDF-ORDER-001', 4, 341.50, 'DELIVERED',        'PAID',    1, 1),
('MDF-ORDER-002', 5, 126.00, 'PLACED',           'PAID',    2, NULL),
('MDF-ORDER-003', 6, 490.75, 'OUT_FOR_DELIVERY', 'PAID',    3, 3),
('MDF-ORDER-004', 7,  87.50, 'PROCESSING',       'PAID',    4, NULL),
('MDF-ORDER-005', 8, 215.00, 'VERIFIED',         'PAID',    5, NULL);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
INSERT INTO order_items (order_id, medicine_id, quantity, unit_price, subtotal) VALUES
(1, 15, 1, 285.00, 285.00),
(1, 6,  3, 12.50,   37.50),
(1, 26, 1, 22.50,   22.50),
-- Wait for addresses / maths...
(2, 6,  5, 12.50,  62.50),
(2, 30, 1, 42.00,  42.00),
(2, 26, 1, 22.50,  22.50),
(3, 1,  2, 45.50,  91.00),
(3, 18, 2, 65.00, 130.00),
(3, 22, 3, 85.00, 255.00),
(4, 9,  2, 22.00,  44.00),
(4, 6,  4, 12.50,  50.00),
(5, 12, 3, 28.00,  84.00),
(5, 22, 1, 85.00,  85.00),
(5, 27, 2, 28.00,  56.00);

-- ============================================================
-- REVIEWS
-- ============================================================
INSERT INTO reviews (medicine_id, customer_id, rating, comment) VALUES
(6,  4, 5, 'Excellent product! Works immediately for fever relief. Great value for money.'),
(15, 4, 4, 'Effective insulin but the price is a bit high. Reliable quality though.'),
(30, 5, 5, 'Omeprazole completely resolved my acid reflux issues. Highly recommended!'),
(26, 5, 4, 'Good antihistamine but had mild drowsiness. Would recommend for severe allergies.'),
(1,  6, 5, 'Very effective antibiotic. Completed the course and infection cleared quickly.'),
(18, 6, 5, 'Atorvastatin has significantly reduced my cholesterol. Doctor confirmed improvement.'),
(9,  7, 4, 'Good NSAID for pain relief. Takes about 30 minutes to take effect.'),
(22, 8, 5, 'Excellent Vitamin D3 supplement. Energy levels noticeably improved after 2 weeks.'),
(12, 8, 4, 'Metformin is effective and well-tolerated. Minimal side effects for me.'),
(25, 4, 3, 'Decent omega-3 supplement but capsules are large and have slight fishy taste.');

-- ============================================================
-- DELIVERIES
-- ============================================================
INSERT INTO deliveries (order_id, delivery_agent_id, status, optimal_route_nodes, total_distance_km, estimated_time_mins, picked_up_at, delivered_at) VALUES
(1, 2, 'DELIVERED', 'Central Pharmacy Hub ➔ North Distribution Junction ➔ Residential Sector A', 6.00, 14, '2026-08-01 10:30:00', '2026-08-01 11:15:00'),
(3, 3, 'IN_TRANSIT', 'Central Pharmacy Hub ➔ East Medical Depot ➔ Residential Sector C',          7.80, 18, '2026-08-09 14:00:00', NULL);
