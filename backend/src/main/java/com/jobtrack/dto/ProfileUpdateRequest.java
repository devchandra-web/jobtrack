package com.jobtrack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    // Recruiter specific profile updates
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String location;
    private String logoUrl;
}
