package com.mediflow.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDTO {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalMedicines;
    private Integer lowStockCount;
    private Integer expiringCount;
    private List<OrderDTO> recentOrders;

    public DashboardSummaryDTO() {}

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public Long getTotalMedicines() { return totalMedicines; }
    public void setTotalMedicines(Long totalMedicines) { this.totalMedicines = totalMedicines; }

    public Integer getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(Integer lowStockCount) { this.lowStockCount = lowStockCount; }

    public Integer getExpiringCount() { return expiringCount; }
    public void setExpiringCount(Integer expiringCount) { this.expiringCount = expiringCount; }

    public List<OrderDTO> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDTO> recentOrders) { this.recentOrders = recentOrders; }
}
