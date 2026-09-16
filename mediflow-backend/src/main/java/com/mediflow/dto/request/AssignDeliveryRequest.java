package com.mediflow.dto.request;

import jakarta.validation.constraints.NotNull;

public class AssignDeliveryRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Delivery Agent ID is required")
    private Long deliveryAgentId;

    private Integer startHubNodeId = 1; // Default Central Pharmacy Hub

    public AssignDeliveryRequest() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getDeliveryAgentId() { return deliveryAgentId; }
    public void setDeliveryAgentId(Long deliveryAgentId) { this.deliveryAgentId = deliveryAgentId; }

    public Integer getStartHubNodeId() { return startHubNodeId; }
    public void setStartHubNodeId(Integer startHubNodeId) { this.startHubNodeId = startHubNodeId; }
}
