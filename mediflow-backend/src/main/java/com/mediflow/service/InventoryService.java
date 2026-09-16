package com.mediflow.service;

import com.mediflow.dsa.heap.ExpiryMinHeap;
import com.mediflow.dsa.heap.InventoryMinHeap;
import com.mediflow.dto.request.UpdateInventoryRequest;
import com.mediflow.dto.response.InventoryDTO;
import com.mediflow.entity.Inventory;
import com.mediflow.entity.Medicine;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.InventoryRepository;
import com.mediflow.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    public List<InventoryDTO> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryMinHeap.InventoryStockItem> getLowStockInventoryMinHeap(int limit) {
        InventoryMinHeap minHeap = new InventoryMinHeap();
        List<Inventory> allBatches = inventoryRepository.findAll();

        for (Inventory inv : allBatches) {
            String medName = inv.getMedicine() != null ? inv.getMedicine().getName() : "Unknown";
            minHeap.insert(new InventoryMinHeap.InventoryStockItem(
                    inv.getId(), medName, inv.getBatchNumber(), inv.getStockQuantity(), inv.getReorderLevel()
            ));
        }

        return minHeap.getTopLowStockItems(limit);
    }

    public List<ExpiryMinHeap.InventoryExpiryItem> getExpiringSoonInventoryMinHeap(int limit) {
        ExpiryMinHeap expiryHeap = new ExpiryMinHeap();
        List<Inventory> allBatches = inventoryRepository.findAll();

        for (Inventory inv : allBatches) {
            String medName = inv.getMedicine() != null ? inv.getMedicine().getName() : "Unknown";
            expiryHeap.insert(new ExpiryMinHeap.InventoryExpiryItem(
                    inv.getId(), medName, inv.getBatchNumber(), inv.getExpiryDate(), inv.getStockQuantity()
            ));
        }

        return expiryHeap.getEarliestExpiringItems(limit);
    }

    @Transactional
    public InventoryDTO updateOrCreateInventoryBatch(UpdateInventoryRequest request) {
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + request.getMedicineId()));

        Inventory inventory = inventoryRepository.findByBatchNumber(request.getBatchNumber())
                .orElse(new Inventory());

        inventory.setMedicine(medicine);
        inventory.setBatchNumber(request.getBatchNumber());
        inventory.setStockQuantity(request.getStockQuantity());
        inventory.setReorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : 10);
        inventory.setExpiryDate(request.getExpiryDate());

        // Dynamic status calculation
        if (request.getExpiryDate().isBefore(LocalDate.now())) {
            inventory.setStatus("EXPIRED");
        } else if (request.getStockQuantity() <= 0) {
            inventory.setStatus("OUT_OF_STOCK");
        } else if (request.getStockQuantity() <= inventory.getReorderLevel()) {
            inventory.setStatus("LOW_STOCK");
        } else {
            inventory.setStatus("IN_STOCK");
        }

        Inventory saved = inventoryRepository.save(inventory);
        return mapToDTO(saved);
    }

    public InventoryDTO mapToDTO(Inventory inventory) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(inventory.getId());
        if (inventory.getMedicine() != null) {
            dto.setMedicineId(inventory.getMedicine().getId());
            dto.setMedicineName(inventory.getMedicine().getName());
        }
        dto.setBatchNumber(inventory.getBatchNumber());
        dto.setStockQuantity(inventory.getStockQuantity());
        dto.setReorderLevel(inventory.getReorderLevel());
        dto.setExpiryDate(inventory.getExpiryDate());
        dto.setStatus(inventory.getStatus());
        dto.setUpdatedAt(inventory.getUpdatedAt());
        return dto;
    }
}
