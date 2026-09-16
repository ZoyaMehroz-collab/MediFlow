package com.mediflow.controller;

import com.mediflow.dto.response.DashboardSummaryDTO;
import com.mediflow.entity.Role;
import com.mediflow.entity.User;
import com.mediflow.repository.UserRepository;
import com.mediflow.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDTO> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.ROLE_CUSTOMER));
    }

    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllDeliveryAgents() {
        return ResponseEntity.ok(userRepository.findByRole(Role.ROLE_DELIVERY_AGENT));
    }
}
