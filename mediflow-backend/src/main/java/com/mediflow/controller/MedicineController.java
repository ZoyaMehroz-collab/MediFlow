package com.mediflow.controller;

import com.mediflow.dto.request.CreateMedicineRequest;
import com.mediflow.dto.response.MedicineDTO;
import com.mediflow.dsa.trie.TrieNode;
import com.mediflow.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public ResponseEntity<Page<MedicineDTO>> getMedicines(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(medicineService.getMedicines(categoryId, search, sortBy, sortDir, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<Map<String, Object>> autocomplete(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        List<TrieNode.MedicineSearchResult> suggestions = medicineService.searchAutocomplete(query, limit);
        Map<String, Object> response = new HashMap<>();
        response.put("query", query);
        response.put("matchCount", suggestions.size());
        response.put("suggestions", suggestions);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<MedicineDTO> createMedicine(@Valid @RequestBody CreateMedicineRequest request) {
        return new ResponseEntity<>(medicineService.createMedicine(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTO> updateMedicine(@PathVariable Long id,
                                                      @Valid @RequestBody CreateMedicineRequest request) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(Map.of("message", "Medicine deactivated successfully"));
    }
}
