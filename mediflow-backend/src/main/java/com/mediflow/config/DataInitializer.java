package com.mediflow.config;

import com.mediflow.entity.*;
import com.mediflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already present
        }

        String pass = passwordEncoder.encode("Password123!");

        // 1. Seed Users
        User admin = userRepository.save(new User("admin@mediflow.com", pass, "Dr. Sarah Mitchell", "+1-555-0101", Role.ROLE_PHARMACY_ADMIN));
        User agent1 = userRepository.save(new User("agent1@mediflow.com", pass, "David Wilson", "+1-555-0201", Role.ROLE_DELIVERY_AGENT));
        User agent2 = userRepository.save(new User("agent2@mediflow.com", pass, "Marcus Thompson", "+1-555-0202", Role.ROLE_DELIVERY_AGENT));
        User customer1 = userRepository.save(new User("john.doe@email.com", pass, "John Doe", "+1-555-0301", Role.ROLE_CUSTOMER));
        User customer2 = userRepository.save(new User("jane.smith@email.com", pass, "Jane Smith", "+1-555-0302", Role.ROLE_CUSTOMER));
        User customer3 = userRepository.save(new User("alex.kumar@email.com", pass, "Alex Kumar", "+1-555-0303", Role.ROLE_CUSTOMER));

        // 2. Seed Addresses
        Address addr1 = new Address();
        addr1.setUser(customer1);
        addr1.setRecipientName("John Doe");
        addr1.setPhone("+1-555-0301");
        addr1.setStreetAddress("42 Maple Street, Apt 3B");
        addr1.setCity("Springfield");
        addr1.setState("Illinois");
        addr1.setPostalCode("62701");
        addr1.setGraphNodeId(6);
        addr1.setDefault(true);
        addressRepository.save(addr1);

        Address addr2 = new Address();
        addr2.setUser(customer2);
        addr2.setRecipientName("Jane Smith");
        addr2.setPhone("+1-555-0302");
        addr2.setStreetAddress("88 Oak Ridge Avenue");
        addr2.setCity("Springfield");
        addr2.setState("Illinois");
        addr2.setPostalCode("62702");
        addr2.setGraphNodeId(4);
        addr2.setDefault(true);
        addressRepository.save(addr2);

        // 3. Seed Categories
        Category catAntibiotics = categoryRepository.save(new Category("Antibiotics", "Medicines that fight bacterial infections", "shield-virus"));
        Category catAnalgesics  = categoryRepository.save(new Category("Analgesics", "Pain relief and fever reduction medicines", "thermometer"));
        Category catDiabetics   = categoryRepository.save(new Category("Antidiabetics", "Medicines for blood sugar management", "droplet"));
        Category catCardio      = categoryRepository.save(new Category("Cardiovascular", "Heart and blood pressure medicines", "heart-pulse"));
        Category catVitamins    = categoryRepository.save(new Category("Vitamins & Supplements", "Nutritional supplements and vitamins", "capsules"));
        Category catAllergy     = categoryRepository.save(new Category("Antihistamines & Respiratory", "Allergy relief, asthma and respiratory care", "leaf"));
        Category catGastro      = categoryRepository.save(new Category("Gastrointestinal", "Digestive system and gut health medicines", "stomach"));
        Category catDerma       = categoryRepository.save(new Category("Dermatology & Skincare", "Skin care, topical creams, and antifungal solutions", "skin"));
        Category catNeuro       = categoryRepository.save(new Category("Mental Health & Neurology", "Neurological health and wellness support", "activity"));

        // 4. Seed Medicines & Batches
        Medicine medAmox = createMedWithBatch(catAntibiotics, "Amoxicillin 500mg Capsules", "Amoxicillin", "PharmaCo Labs", "Capsule", "500mg", new BigDecimal("45.50"), true, "Broad-spectrum penicillin antibiotic for bacterial infections", "AMX-2026-001", 85, 20, LocalDate.of(2027, 8, 15));
        Medicine medAzith = createMedWithBatch(catAntibiotics, "Azithromycin 250mg Tablets", "Azithromycin", "MediGen Inc.", "Tablet", "250mg", new BigDecimal("78.00"), true, "Macrolide antibiotic used to treat respiratory infections", "AZI-2026-001", 15, 15, LocalDate.of(2026, 11, 30));
        Medicine medCipro = createMedWithBatch(catAntibiotics, "Ciprofloxacin 500mg Tablets", "Ciprofloxacin", "HealthPharm", "Tablet", "500mg", new BigDecimal("55.75"), true, "Fluoroquinolone antibiotic for urinary tract & digestive infections", "CIP-2026-001", 120, 25, LocalDate.of(2027, 3, 31));
        Medicine medDoxy = createMedWithBatch(catAntibiotics, "Doxycycline 100mg Capsules", "Doxycycline Hyclate", "Apex Pharma", "Capsule", "100mg", new BigDecimal("62.00"), true, "Tetracycline class antibiotic for skin & respiratory care", "DOX-2026-001", 90, 20, LocalDate.of(2027, 10, 15));
        Medicine medAugmentin = createMedWithBatch(catAntibiotics, "Augmentin 625mg Tablets", "Amoxicillin + Clavulanic Acid", "GSK Healthcare", "Tablet", "625mg", new BigDecimal("135.00"), true, "Synergistic antibiotic combination for resistant infections", "AUG-2026-001", 65, 15, LocalDate.of(2027, 6, 30));

        Medicine medPara500 = createMedWithBatch(catAnalgesics, "Paracetamol 500mg Tablets", "Paracetamol", "GenMed", "Tablet", "500mg", new BigDecimal("12.50"), false, "Common analgesic and antipyretic for fast fever and mild pain relief", "PAR-2026-001", 350, 50, LocalDate.of(2028, 6, 30));
        Medicine medPara650 = createMedWithBatch(catAnalgesics, "Paracetamol 650mg ER Tablets", "Paracetamol", "GenMed", "Tablet", "650mg", new BigDecimal("18.00"), false, "Extended release formula for long-lasting fever and body ache management", "PAR-2026-002", 180, 30, LocalDate.of(2027, 1, 31));
        Medicine medIbu = createMedWithBatch(catAnalgesics, "Ibuprofen 400mg Tablets", "Ibuprofen", "HealthPharm", "Tablet", "400mg", new BigDecimal("22.00"), false, "Non-steroidal anti-inflammatory (NSAID) for swelling, pain and fever", "IBU-2026-001", 220, 40, LocalDate.of(2027, 4, 30));
        Medicine medNapro = createMedWithBatch(catAnalgesics, "Naproxen 500mg Tablets", "Naproxen Sodium", "Syntex Care", "Tablet", "500mg", new BigDecimal("48.50"), true, "Long-acting pain relief for joint stiffness, arthritis and muscle pain", "NAP-2026-001", 110, 20, LocalDate.of(2027, 9, 20));
        Medicine medDiclo = createMedWithBatch(catAnalgesics, "Diclofenac 50mg Gel 30g", "Diclofenac Sodium", "VoltaGel", "Gel", "50mg/g", new BigDecimal("95.00"), false, "Fast-absorbing topical pain relief gel for muscle sprains & joint pain", "DIC-2026-001", 80, 15, LocalDate.of(2027, 12, 31));

        Medicine medMet500 = createMedWithBatch(catDiabetics, "Metformin 500mg Tablets", "Metformin HCl", "DiaCare Pharma", "Tablet", "500mg", new BigDecimal("28.00"), true, "First-line oral antidiabetic medication for Type 2 diabetes glycemic control", "MTF-2026-001", 145, 30, LocalDate.of(2027, 5, 31));
        Medicine medMet1000 = createMedWithBatch(catDiabetics, "Metformin 1000mg Sustained Release", "Metformin ER", "DiaCare Pharma", "Tablet", "1000mg", new BigDecimal("42.00"), true, "Once-daily extended release metformin formulation for blood glucose stabilization", "MTF-2026-002", 95, 20, LocalDate.of(2027, 7, 31));
        Medicine medInsulin = createMedWithBatch(catDiabetics, "Insulin Glargine 100IU/ml Pen", "Insulin Glargine", "InsulinCare Ltd", "Injection", "100IU/ml", new BigDecimal("285.00"), true, "Long-acting basal insulin analog pen for 24-hour glycemic balance", "INS-2026-001", 18, 10, LocalDate.of(2026, 12, 20));
        Medicine medGlime = createMedWithBatch(catDiabetics, "Glimepiride 2mg Tablets", "Glimepiride", "Sanofi Health", "Tablet", "2mg", new BigDecimal("34.00"), true, "Sulfonylurea antidiabetic agent that stimulates insulin secretion", "GLM-2026-001", 130, 25, LocalDate.of(2027, 8, 15));
        Medicine medSita = createMedWithBatch(catDiabetics, "Sitagliptin 100mg Tablets", "Sitagliptin", "Merck Care", "Tablet", "100mg", new BigDecimal("115.00"), true, "DPP-4 inhibitor regulating post-meal blood sugar levels", "SIT-2026-001", 75, 15, LocalDate.of(2027, 11, 30));

        Medicine medAmlo = createMedWithBatch(catCardio, "Amlodipine 5mg Tablets", "Amlodipine Besylate", "CardioPharm", "Tablet", "5mg", new BigDecimal("32.50"), true, "Calcium channel blocker for treating hypertension and angina", "AML-2026-001", 167, 30, LocalDate.of(2027, 8, 31));
        Medicine medAtor = createMedWithBatch(catCardio, "Atorvastatin 20mg Tablets", "Atorvastatin Calcium", "LipidControl Inc.", "Tablet", "20mg", new BigDecimal("65.00"), true, "Statin medication for lowering LDL cholesterol and cardiovascular protection", "ATO-2026-001", 98, 20, LocalDate.of(2027, 1, 15));
        Medicine medTelmi = createMedWithBatch(catCardio, "Telmisartan 40mg Tablets", "Telmisartan", "CardioPharm", "Tablet", "40mg", new BigDecimal("54.00"), true, "Angiotensin II receptor blocker (ARB) for blood pressure management", "TEL-2026-001", 140, 25, LocalDate.of(2027, 9, 30));
        Medicine medRosuva = createMedWithBatch(catCardio, "Rosuvastatin 10mg Tablets", "Rosuvastatin", "LipidControl Inc.", "Tablet", "10mg", new BigDecimal("72.00"), true, "High-potency lipid-lowering agent for arterial cardiovascular health", "ROS-2026-001", 110, 20, LocalDate.of(2027, 10, 31));

        Medicine medVitD3 = createMedWithBatch(catVitamins, "Vitamin D3 60000IU Softgels", "Cholecalciferol", "NutriHealth", "Capsule", "60000IU", new BigDecimal("85.00"), false, "High-potency weekly vitamin D3 supplement for bone, joint & immune strength", "VD3-2026-001", 200, 40, LocalDate.of(2027, 9, 30));
        Medicine medOmega3 = createMedWithBatch(catVitamins, "Omega-3 Fish Oil 1000mg", "Omega-3 EPA/DHA", "NutriHealth", "Capsule", "1000mg", new BigDecimal("120.00"), false, "Purified essential omega-3 fatty acids for heart, brain and eye health", "OMG-2026-001", 88, 20, LocalDate.of(2026, 12, 20));
        Medicine medVitC = createMedWithBatch(catVitamins, "Vitamin C 1000mg Effervescent", "Ascorbic Acid + Zinc", "BoostHealth", "Tablet", "1000mg", new BigDecimal("65.00"), false, "Fizzy immunity booster tablets packed with vitamin C and active zinc", "VTC-2026-001", 250, 30, LocalDate.of(2028, 3, 31));
        Medicine medB12 = createMedWithBatch(catVitamins, "Methylcobalamin B12 1500mcg", "Vitamin B12", "NutriHealth", "Tablet", "1500mcg", new BigDecimal("90.00"), false, "Bioactive Vitamin B12 for nerve health, vitality, and red blood cell support", "B12-2026-001", 175, 25, LocalDate.of(2027, 11, 30));

        Medicine medCeti = createMedWithBatch(catAllergy, "Cetirizine 10mg Tablets", "Cetirizine HCl", "AllergyFree", "Tablet", "10mg", new BigDecimal("22.50"), false, "Non-drowsy 24-hour antihistamine for seasonal allergy & sneeze relief", "CET-2026-001", 150, 20, LocalDate.of(2027, 9, 15));
        Medicine medLevo = createMedWithBatch(catAllergy, "Levocetirizine 5mg Tablets", "Levocetirizine", "AllergyFree", "Tablet", "5mg", new BigDecimal("35.00"), false, "Next-generation antihistamine for fast relief from runny nose and hives", "LEV-2026-001", 120, 20, LocalDate.of(2027, 8, 31));
        Medicine medMonte = createMedWithBatch(catAllergy, "Montelukast 10mg Tablets", "Montelukast Sodium", "RespiraCare", "Tablet", "10mg", new BigDecimal("88.00"), true, "Leukotriene receptor antagonist for asthma control and severe allergic rhinitis", "MON-2026-001", 85, 15, LocalDate.of(2027, 7, 31));
        Medicine medSal = createMedWithBatch(catAllergy, "Salbutamol Inhaler 100mcg", "Salbutamol", "RespiraCare", "Inhaler", "100mcg/dose", new BigDecimal("160.00"), true, "Fast-acting bronchodilator inhaler for acute asthma and wheezing relief", "SAL-2026-001", 45, 10, LocalDate.of(2027, 5, 31));

        Medicine medOme = createMedWithBatch(catGastro, "Omeprazole 20mg Capsules", "Omeprazole", "GastroMed", "Capsule", "20mg", new BigDecimal("42.00"), false, "Proton pump inhibitor (PPI) for acid reflux, GERD, and stomach heartburn", "OMP-2026-001", 198, 40, LocalDate.of(2027, 5, 31));
        Medicine medPanto = createMedWithBatch(catGastro, "Pantoprazole 40mg Tablets", "Pantoprazole Sodium", "GastroMed", "Tablet", "40mg", new BigDecimal("55.00"), true, "Targeted acid regulation for peptic ulcers and severe acid indigestion", "PAN-2026-001", 160, 30, LocalDate.of(2027, 10, 31));
        Medicine medProbio = createMedWithBatch(catGastro, "Probiotic Gut Care 10 Billion CFU", "Multi-strain Probiotics", "BioGut", "Capsule", "10B CFU", new BigDecimal("145.00"), false, "Advanced gut microbiome balance capsules with prebiotics and digestive enzymes", "PRO-2026-001", 90, 20, LocalDate.of(2027, 4, 30));

        Medicine medClotri = createMedWithBatch(catDerma, "Clotrimazole 1% Cream 30g", "Clotrimazole", "DermaCare", "Cream", "1%", new BigDecimal("85.00"), false, "Antifungal topical cream for ringworm, athlete's foot and skin rash", "CLO-2026-001", 76, 15, LocalDate.of(2027, 7, 31));
        Medicine medHydro = createMedWithBatch(catDerma, "Hydrocortisone 1% Ointment 20g", "Hydrocortisone", "DermaCare", "Ointment", "1%", new BigDecimal("92.00"), false, "Mild topical corticosteroid for eczema, itching, redness and insect bites", "HYD-2026-001", 60, 15, LocalDate.of(2027, 8, 31));
        Medicine medSali = createMedWithBatch(catDerma, "Salicylic Acid 2% Acne Gel 15g", "Salicylic Acid", "ClearSkin Labs", "Gel", "2%", new BigDecimal("110.00"), false, "Targeted pore-clearing acne gel to eliminate pimples and blackheads", "SAL-2026-002", 110, 20, LocalDate.of(2027, 11, 30));

        Medicine medEsci = createMedWithBatch(catNeuro, "Escitalopram 10mg Tablets", "Escitalopram Oxalate", "MindHealth", "Tablet", "10mg", new BigDecimal("75.00"), true, "Selective serotonin reuptake inhibitor (SSRI) for generalized anxiety & depression", "ESC-2026-001", 70, 15, LocalDate.of(2027, 9, 30));
        Medicine medGaba = createMedWithBatch(catNeuro, "Gabapentin 300mg Capsules", "Gabapentin", "NeuroPharma", "Capsule", "300mg", new BigDecimal("125.00"), true, "Anticonvulsant & nerve pain medication for neuropathic symptoms", "GAB-2026-001", 55, 15, LocalDate.of(2027, 6, 30));

        // 5. Seed Sample Completed Customer Orders for Admin Analytics
        createSampleOrder(customer1, addr1, "DELIVERED", new BigDecimal("110.00"), 
            new OrderItemSeed(medPara500, 2, new BigDecimal("12.50")),
            new OrderItemSeed(medVitD3, 1, new BigDecimal("85.00"))
        );

        createSampleOrder(customer2, addr2, "PROCESSING", new BigDecimal("250.00"), 
            new OrderItemSeed(medOmega3, 1, new BigDecimal("120.00")),
            new OrderItemSeed(medVitC, 2, new BigDecimal("65.00"))
        );

        createSampleOrder(customer3, addr1, "OUT_FOR_DELIVERY", new BigDecimal("161.00"), 
            new OrderItemSeed(medDiclo, 1, new BigDecimal("95.00")),
            new OrderItemSeed(medIbu, 3, new BigDecimal("22.00"))
        );

        System.out.println(">>> MediFlow demo seed data loaded successfully with 30+ medicines, categories, and analytics sample orders.");
    }

    private Medicine createMedWithBatch(Category cat, String name, String generic, String mfr, String form, String str, BigDecimal price, boolean rx, String desc, String batchNo, int stock, int reorder, LocalDate expiry) {
        Medicine med = new Medicine();
        med.setCategory(cat);
        med.setName(name);
        med.setGenericName(generic);
        med.setManufacturer(mfr);
        med.setDosageForm(form);
        med.setStrength(str);
        med.setUnitPrice(price);
        med.setPrescriptionRequired(rx);
        med.setDescription(desc);
        med = medicineRepository.save(med);

        Inventory inv = new Inventory();
        inv.setMedicine(med);
        inv.setBatchNumber(batchNo);
        inv.setStockQuantity(stock);
        inv.setReorderLevel(reorder);
        inv.setStatus(stock <= reorder ? "LOW_STOCK" : stock == 0 ? "OUT_OF_STOCK" : "IN_STOCK");
        inv.setExpiryDate(expiry);
        inventoryRepository.save(inv);

        return med;
    }

    private void createSampleOrder(User customer, Address addr, String status, BigDecimal total, OrderItemSeed... items) {
        Order order = new Order();
        order.setOrderNumber("MDF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCustomer(customer);
        order.setShippingAddress(addr);
        order.setOrderStatus(status);
        order.setPaymentStatus("PAID");
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        for (OrderItemSeed seed : items) {
            BigDecimal subtotal = seed.price.multiply(BigDecimal.valueOf(seed.qty));
            OrderItem item = new OrderItem(saved, seed.medicine, seed.qty, seed.price, subtotal);
            orderItemRepository.save(item);
        }
    }

    private static class OrderItemSeed {
        Medicine medicine;
        int qty;
        BigDecimal price;

        OrderItemSeed(Medicine med, int q, BigDecimal p) {
            this.medicine = med;
            this.qty = q;
            this.price = p;
        }
    }
}
