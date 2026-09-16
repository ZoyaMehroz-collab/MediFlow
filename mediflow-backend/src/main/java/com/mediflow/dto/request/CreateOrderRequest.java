package com.mediflow.dto.request;

import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {

    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    private Long prescriptionId; // Optional if no prescription items

    public CreateOrderRequest() {}

    public CreateOrderRequest(Long shippingAddressId, Long prescriptionId) {
        this.shippingAddressId = shippingAddressId;
        this.prescriptionId = prescriptionId;
    }

    public Long getShippingAddressId() { return shippingAddressId; }
    public void setShippingAddressId(Long shippingAddressId) { this.shippingAddressId = shippingAddressId; }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }
}
