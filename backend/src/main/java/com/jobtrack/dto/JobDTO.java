package com.jobtrack.dto;

import com.jobtrack.entity.Job;
import com.jobtrack.entity.JobStatus;
import com.jobtrack.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private Long id;
    private UserDTO recruiter;
    private String title;
    private String companyName;
    private String location;
    private JobType jobType;
    private String experienceLevel;
    private String salaryRange;
    private String description;
    private String requirements;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long applicantCount;

    public static JobDTO fromEntity(Job job, long applicantCount) {
        if (job == null) return null;
        return JobDTO.builder()
                .id(job.getId())
                .recruiter(UserDTO.fromEntity(job.getRecruiter()))
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .salaryRange(job.getSalaryRange())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .applicantCount(applicantCount)
                .build();
    }
}
