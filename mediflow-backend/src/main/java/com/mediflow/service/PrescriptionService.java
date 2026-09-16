package com.mediflow.service;

import com.mediflow.dto.request.VerifyPrescriptionRequest;
import com.mediflow.dto.response.PrescriptionDTO;
import com.mediflow.entity.Prescription;
import com.mediflow.entity.User;
import com.mediflow.exception.BadRequestException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AuthService authService;

    private static final String UPLOAD_DIR = "uploads/prescriptions/";

    @Transactional
    public PrescriptionDTO uploadPrescription(MultipartFile file) {
        User customer = authService.getCurrentAuthenticatedUser();

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded prescription file cannot be empty");
        }

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";

            String storedFilename = UUID.randomUUID().toString() + extension;
            Path destinationPath = Paths.get(UPLOAD_DIR + storedFilename);

            Files.copy(file.getInputStream(), destinationPath);

            Prescription rx = new Prescription();
            rx.setCustomer(customer);
            rx.setFilePath(destinationPath.toString());
            rx.setOriginalFilename(originalFilename);
            rx.setStatus("PENDING");

            Prescription saved = prescriptionRepository.save(rx);
            return mapToDTO(saved);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to upload prescription file: " + ex.getMessage());
        }
    }

    public List<PrescriptionDTO> getUserPrescriptions() {
        User customer = authService.getCurrentAuthenticatedUser();
        return prescriptionRepository.findByCustomerId(customer.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getAllPrescriptions(String status) {
        if (status != null && !status.trim().isEmpty()) {
            return prescriptionRepository.findByStatus(status.toUpperCase().trim()).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }
        return prescriptionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionDTO verifyPrescription(Long id, VerifyPrescriptionRequest request) {
        Prescription rx = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with ID: " + id));

        rx.setStatus(request.getStatus().toUpperCase().trim());
        rx.setAdminNotes(request.getAdminNotes());

        Prescription updated = prescriptionRepository.save(rx);
        return mapToDTO(updated);
    }

    public PrescriptionDTO mapToDTO(Prescription rx) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(rx.getId());
        if (rx.getCustomer() != null) {
            dto.setCustomerId(rx.getCustomer().getId());
            dto.setCustomerName(rx.getCustomer().getFullName());
        }
        dto.setFilePath(rx.getFilePath());
        dto.setOriginalFilename(rx.getOriginalFilename());
        dto.setStatus(rx.getStatus());
        dto.setAdminNotes(rx.getAdminNotes());
        dto.setUploadedAt(rx.getUploadedAt());
        return dto;
    }
}
