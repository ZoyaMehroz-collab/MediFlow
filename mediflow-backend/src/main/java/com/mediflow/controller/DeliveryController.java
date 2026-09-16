package com.mediflow.controller;

import com.mediflow.dto.request.AssignDeliveryRequest;
import com.mediflow.dto.response.DeliveryDTO;
import com.mediflow.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/my")
    public ResponseEntity<List<DeliveryDTO>> getMyDeliveries() {
        return ResponseEntity.ok(deliveryService.getMyDeliveries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @PostMapping("/assign")
    public ResponseEntity<DeliveryDTO> assignDelivery(@Valid @RequestBody AssignDeliveryRequest request) {
        return new ResponseEntity<>(deliveryService.assignDelivery(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryDTO> updateDeliveryStatus(@PathVariable Long id,
                                                             @RequestParam String status) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, status));
    }
}
