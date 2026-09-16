package com.mediflow.controller;

import com.mediflow.dto.request.VerifyPrescriptionRequest;
import com.mediflow.dto.response.PrescriptionDTO;
import com.mediflow.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/upload")
    public ResponseEntity<PrescriptionDTO> uploadPrescription(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(prescriptionService.uploadPrescription(file), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionDTO>> getMyPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getUserPrescriptions());
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions(status));
    }

    @PutMapping("/admin/{id}/verify")
    public ResponseEntity<PrescriptionDTO> verifyPrescription(@PathVariable Long id,
                                                               @Valid @RequestBody VerifyPrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.verifyPrescription(id, request));
    }
}
