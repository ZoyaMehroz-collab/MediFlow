package com.mediflow.service;

import com.mediflow.dsa.cache.MedicineCacheMap;
import com.mediflow.dsa.trie.MedicineTrie;
import com.mediflow.dsa.trie.TrieNode;
import com.mediflow.dto.request.CreateMedicineRequest;
import com.mediflow.dto.response.MedicineDTO;
import com.mediflow.entity.Category;
import com.mediflow.entity.Medicine;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.CategoryRepository;
import com.mediflow.repository.MedicineRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MedicineTrie medicineTrie;

    @Autowired
    private MedicineCacheMap medicineCacheMap;

    @PostConstruct
    public void initTrieAndCacheIndex() {
        refreshTrieAndCache();
    }

    public synchronized void refreshTrieAndCache() {
        medicineTrie.clear();
        medicineCacheMap.clear();

        List<Medicine> activeMedicines = medicineRepository.findByActiveTrue();
        for (Medicine med : activeMedicines) {
            // Index into Trie for prefix autocomplete
            medicineTrie.insert(med.getId(), med.getName(), med.getDosageForm(), med.getUnitPrice().toString());
            if (med.getGenericName() != null && !med.getGenericName().isEmpty()) {
                medicineTrie.insert(med.getId(), med.getGenericName(), med.getDosageForm(), med.getUnitPrice().toString());
            }

            // Index into HashMap cache
            medicineCacheMap.put(med.getId(), med.getName(), med.getUnitPrice(), med.isActive());
        }
    }

    public List<TrieNode.MedicineSearchResult> searchAutocomplete(String query, int maxResults) {
        return medicineTrie.searchPrefix(query, maxResults);
    }

    public Page<MedicineDTO> getMedicines(Long categoryId, String search, String sortBy, String sortDir, int page, int size) {
        Sort sort = Sort.by("name").ascending();
        if ("price".equalsIgnoreCase(sortBy)) {
            sort = "desc".equalsIgnoreCase(sortDir) ? Sort.by("unitPrice").descending() : Sort.by("unitPrice").ascending();
        } else if ("id".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("id").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Medicine> medicinePage = medicineRepository.searchMedicines(categoryId, search, pageable);

        return medicinePage.map(this::mapToDTO);
    }

    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));
        return mapToDTO(medicine);
    }

    @Transactional
    public MedicineDTO createMedicine(CreateMedicineRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Medicine medicine = new Medicine();
        medicine.setCategory(category);
        medicine.setName(request.getName());
        medicine.setGenericName(request.getGenericName());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setDosageForm(request.getDosageForm());
        medicine.setStrength(request.getStrength());
        medicine.setUnitPrice(request.getUnitPrice());
        medicine.setPrescriptionRequired(request.isPrescriptionRequired());
        medicine.setDescription(request.getDescription());
        medicine.setImageUrl(request.getImageUrl());
        medicine.setActive(true);

        Medicine saved = medicineRepository.save(medicine);
        refreshTrieAndCache();
        return mapToDTO(saved);
    }

    @Transactional
    public MedicineDTO updateMedicine(Long id, CreateMedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        medicine.setCategory(category);
        medicine.setName(request.getName());
        medicine.setGenericName(request.getGenericName());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setDosageForm(request.getDosageForm());
        medicine.setStrength(request.getStrength());
        medicine.setUnitPrice(request.getUnitPrice());
        medicine.setPrescriptionRequired(request.isPrescriptionRequired());
        medicine.setDescription(request.getDescription());
        medicine.setImageUrl(request.getImageUrl());

        Medicine updated = medicineRepository.save(medicine);
        refreshTrieAndCache();
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));
        medicine.setActive(false);
        medicineRepository.save(medicine);
        refreshTrieAndCache();
    }

    public MedicineDTO mapToDTO(Medicine medicine) {
        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        if (medicine.getCategory() != null) {
            dto.setCategoryId(medicine.getCategory().getId());
            dto.setCategoryName(medicine.getCategory().getName());
        }
        dto.setName(medicine.getName());
        dto.setGenericName(medicine.getGenericName());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());
        dto.setUnitPrice(medicine.getUnitPrice());
        dto.setPrescriptionRequired(medicine.isPrescriptionRequired());
        dto.setDescription(medicine.getDescription());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setActive(medicine.isActive());
        return dto;
    }
}
