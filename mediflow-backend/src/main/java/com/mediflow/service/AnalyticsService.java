package com.mediflow.service;

import com.mediflow.dto.response.DashboardSummaryDTO;
import com.mediflow.dto.response.OrderDTO;
import com.mediflow.entity.Role;
import com.mediflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private OrderService orderService;

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO dto = new DashboardSummaryDTO();

        // Total revenue from all DELIVERED or PLACED orders
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalRevenue(totalRevenue);

        // Counts
        dto.setTotalOrders(orderRepository.count());
        dto.setTotalCustomers(userRepository.findByRole(Role.ROLE_CUSTOMER).stream().count());
        dto.setTotalMedicines(medicineRepository.count());

        // Low stock count (stock <= 15)
        int lowStockCount = inventoryRepository.findByStockQuantityLessThanEqual(15).size();
        dto.setLowStockCount(lowStockCount);

        // Expiring soon (within 90 days)
        int expiringCount = inventoryRepository.findByExpiryDateBefore(LocalDate.now().plusDays(90)).size();
        dto.setExpiringCount(expiringCount);

        // Recent 5 orders
        List<OrderDTO> recentOrders = orderRepository
                .findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                .stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());
        dto.setRecentOrders(recentOrders);

        return dto;
    }
}
