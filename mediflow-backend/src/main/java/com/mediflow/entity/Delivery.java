package com.mediflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_agent_id")
    private User deliveryAgent;

    @Column(length = 30)
    private String status = "ASSIGNED"; // ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED

    @Column(name = "optimal_route_nodes", length = 255)
    private String optimalRouteNodes;

    @Column(name = "total_distance_km", precision = 6, scale = 2)
    private BigDecimal totalDistanceKm;

    @Column(name = "estimated_time_mins")
    private Integer estimatedTimeMins;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt = LocalDateTime.now();

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    public Delivery() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public User getDeliveryAgent() { return deliveryAgent; }
    public void setDeliveryAgent(User deliveryAgent) { this.deliveryAgent = deliveryAgent; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOptimalRouteNodes() { return optimalRouteNodes; }
    public void setOptimalRouteNodes(String optimalRouteNodes) { this.optimalRouteNodes = optimalRouteNodes; }

    public BigDecimal getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(BigDecimal totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }

    public Integer getEstimatedTimeMins() { return estimatedTimeMins; }
    public void setEstimatedTimeMins(Integer estimatedTimeMins) { this.estimatedTimeMins = estimatedTimeMins; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getPickedUpAt() { return pickedUpAt; }
    public void setPickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
}
