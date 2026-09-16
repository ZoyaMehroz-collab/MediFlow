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

        // 3. Seed Categories
        Category catAntibiotics = categoryRepository.save(new Category("Antibiotics", "Medicines that fight bacterial infections", "shield-virus"));
        Category catAnalgesics  = categoryRepository.save(new Category("Analgesics", "Pain relief and fever reduction medicines", "thermometer"));
        Category catDiabetics   = categoryRepository.save(new Category("Antidiabetics", "Medicines for blood sugar management", "droplet"));
        Category catCardio      = categoryRepository.save(new Category("Cardiovascular", "Heart and blood pressure medicines", "heart-pulse"));
        Category catVitamins    = categoryRepository.save(new Category("Vitamins & Supplements", "Nutritional supplements and vitamins", "capsules"));
        Category catAllergy     = categoryRepository.save(new Category("Antihistamines", "Allergy relief and antihistamine medicines", "leaf"));
        Category catGastro      = categoryRepository.save(new Category("Gastrointestinal", "Digestive system health medicines", "stomach"));
        Category catDerma       = categoryRepository.save(new Category("Dermatology", "Skin care and topical treatment medicines", "skin"));

        // 4. Seed Medicines & Batches
        createMedWithBatch(catAntibiotics, "Amoxicillin 500mg Capsules", "Amoxicillin", "PharmaCo Labs", "Capsule", "500mg", new BigDecimal("45.50"), true, "Broad-spectrum penicillin antibiotic", "AMX-2026-001", 85, 20, LocalDate.of(2027, 8, 15));
        createMedWithBatch(catAntibiotics, "Azithromycin 250mg Tablets", "Azithromycin", "MediGen Inc.", "Tablet", "250mg", new BigDecimal("78.00"), true, "Macrolide antibiotic used to treat respiratory infections", "AZI-2026-001", 7, 15, LocalDate.of(2026, 11, 30));
        createMedWithBatch(catAntibiotics, "Ciprofloxacin 500mg Tablets", "Ciprofloxacin", "HealthPharm", "Tablet", "500mg", new BigDecimal("55.75"), true, "Fluoroquinolone antibiotic for urinary tract infections", "CIP-2026-001", 120, 25, LocalDate.of(2027, 3, 31));

        createMedWithBatch(catAnalgesics, "Paracetamol 500mg Tablets", "Paracetamol", "GenMed", "Tablet", "500mg", new BigDecimal("12.50"), false, "Common analgesic and antipyretic for pain and fever relief", "PAR-2026-001", 350, 50, LocalDate.of(2028, 6, 30));
        createMedWithBatch(catAnalgesics, "Paracetamol 650mg Tablets", "Paracetamol", "GenMed", "Tablet", "650mg", new BigDecimal("15.00"), false, "Extended release paracetamol for pain management", "PAR-2026-002", 180, 30, LocalDate.of(2027, 1, 31));
        createMedWithBatch(catAnalgesics, "Ibuprofen 400mg Tablets", "Ibuprofen", "HealthPharm", "Tablet", "400mg", new BigDecimal("22.00"), false, "NSAID for pain, inflammation, and fever reduction", "IBU-2026-001", 220, 40, LocalDate.of(2027, 4, 30));

        createMedWithBatch(catDiabetics, "Metformin 500mg Tablets", "Metformin HCl", "DiaCare Pharma", "Tablet", "500mg", new BigDecimal("28.00"), true, "First-line oral antidiabetic for Type 2 diabetes", "MTF-2026-001", 145, 30, LocalDate.of(2027, 5, 31));
        createMedWithBatch(catDiabetics, "Insulin Glargine 100IU/ml", "Insulin Glargine", "InsulinCare Ltd", "Injection", "100IU/ml", new BigDecimal("285.00"), true, "Long-acting basal insulin analog", "INS-2026-001", 3, 10, LocalDate.of(2026, 9, 20));

        createMedWithBatch(catCardio, "Amlodipine 5mg Tablets", "Amlodipine", "CardioPharm", "Tablet", "5mg", new BigDecimal("32.50"), true, "Calcium channel blocker for hypertension", "AML-2026-001", 167, 30, LocalDate.of(2027, 8, 31));
        createMedWithBatch(catCardio, "Atorvastatin 20mg Tablets", "Atorvastatin", "LipidControl Inc.", "Tablet", "20mg", new BigDecimal("65.00"), true, "Statin for reducing cholesterol", "ATO-2026-001", 98, 20, LocalDate.of(2027, 1, 15));

        createMedWithBatch(catVitamins, "Vitamin D3 60000IU Capsules", "Cholecalciferol", "NutriHealth", "Capsule", "60000IU", new BigDecimal("85.00"), false, "Weekly vitamin D3 supplement for bone health", "VD3-2026-001", 200, 40, LocalDate.of(2027, 9, 30));
        createMedWithBatch(catVitamins, "Omega-3 Fish Oil 1000mg", "Omega-3 EPA/DHA", "NutriHealth", "Capsule", "1000mg", new BigDecimal("120.00"), false, "Essential omega-3 fatty acids for heart and brain", "OMG-2026-001", 88, 20, LocalDate.of(2026, 12, 20));

        createMedWithBatch(catAllergy, "Cetirizine 10mg Tablets", "Cetirizine HCl", "AllergyFree", "Tablet", "10mg", new BigDecimal("22.50"), false, "Non-drowsy antihistamine for allergy relief", "CET-2026-001", 9, 20, LocalDate.of(2026, 9, 15));
        createMedWithBatch(catGastro, "Omeprazole 20mg Capsules", "Omeprazole", "GastroMed", "Capsule", "20mg", new BigDecimal("42.00"), false, "Proton pump inhibitor for acid reflux and GERD", "OMP-2026-001", 198, 40, LocalDate.of(2027, 5, 31));
        createMedWithBatch(catDerma, "Clotrimazole 1% Cream 30g", "Clotrimazole", "DermaCare", "Cream", "1%", new BigDecimal("85.00"), false, "Antifungal cream for athlete's foot and ringworm", "CLO-2026-001", 76, 15, LocalDate.of(2027, 7, 31));

        System.out.println(">>> MediFlow demo seed data loaded successfully into database.");
    }

    private void createMedWithBatch(Category cat, String name, String generic, String mfr, String form, String str, BigDecimal price, boolean rx, String desc, String batchNo, int stock, int reorder, LocalDate expiry) {
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
        inv.setExpiryDate(expiry);
        inv.setStatus(stock <= reorder ? "LOW_STOCK" : stock == 0 ? "OUT_OF_STOCK" : "IN_STOCK");
        inventoryRepository.save(inv);
    }
}
