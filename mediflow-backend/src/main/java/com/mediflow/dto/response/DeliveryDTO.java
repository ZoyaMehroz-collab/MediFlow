package com.mediflow.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private Long deliveryAgentId;
    private String deliveryAgentName;
    private String status;
    private String optimalRouteNodes;
    private BigDecimal totalDistanceKm;
    private Integer estimatedTimeMins;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    public DeliveryDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getDeliveryAgentId() { return deliveryAgentId; }
    public void setDeliveryAgentId(Long deliveryAgentId) { this.deliveryAgentId = deliveryAgentId; }

    public String getDeliveryAgentName() { return deliveryAgentName; }
    public void setDeliveryAgentName(String deliveryAgentName) { this.deliveryAgentName = deliveryAgentName; }

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
