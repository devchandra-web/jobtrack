package com.jobtrack.dto;

import com.jobtrack.entity.JobStatus;
import com.jobtrack.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String experienceLevel;

    private String salaryRange;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requirements;

    private JobStatus status;
}
