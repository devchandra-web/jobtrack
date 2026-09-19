package com.jobtrack.dto;

import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long id;
    private JobDTO job;
    private UserDTO candidate;
    private String resumeUrl;
    private String coverLetter;
    private ApplicationStatus status;
    private String notes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public static ApplicationDTO fromEntity(Application application) {
        if (application == null) return null;
        return ApplicationDTO.builder()
                .id(application.getId())
                .job(JobDTO.fromEntity(application.getJob(), 0))
                .candidate(UserDTO.fromEntity(application.getCandidate()))
                .resumeUrl(application.getResumeUrl())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .notes(application.getNotes())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
