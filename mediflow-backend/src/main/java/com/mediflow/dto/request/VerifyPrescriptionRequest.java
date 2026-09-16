package com.mediflow.dto.request;

import jakarta.validation.constraints.NotBlank;

public class VerifyPrescriptionRequest {

    @NotBlank(message = "Status is required (VERIFIED or REJECTED)")
    private String status;

    private String adminNotes;

    public VerifyPrescriptionRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
