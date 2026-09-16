package com.mediflow.controller;

import com.mediflow.dto.request.UpdateInventoryRequest;
import com.mediflow.dto.response.InventoryDTO;
import com.mediflow.dsa.heap.ExpiryMinHeap;
import com.mediflow.dsa.heap.InventoryMinHeap;
import com.mediflow.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryMinHeap.InventoryStockItem>> getLowStockInventory(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(inventoryService.getLowStockInventoryMinHeap(limit));
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<ExpiryMinHeap.InventoryExpiryItem>> getExpiringSoonInventory(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(inventoryService.getExpiringSoonInventoryMinHeap(limit));
    }

    @PostMapping
    public ResponseEntity<InventoryDTO> updateOrCreateInventory(@Valid @RequestBody UpdateInventoryRequest request) {
        return new ResponseEntity<>(inventoryService.updateOrCreateInventoryBatch(request), HttpStatus.OK);
    }
}
