package com.jobtrack.controller;

import com.jobtrack.dto.ApiResponse;
import com.jobtrack.dto.ApplicationDTO;
import com.jobtrack.dto.ApplicationRequest;
import com.jobtrack.dto.ApplicationStatusUpdateRequest;
import com.jobtrack.dto.PagedResponse;
import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDTO>> applyForJob(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ApplicationRequest request) {
        ApplicationDTO created = applicationService.applyForJob(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", created));
    }

    @GetMapping("/candidate/my-applications")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDTO>>> getCandidateApplications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationDTO> applications = applicationService.getCandidateApplications(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Your applications retrieved", applications));
    }

    @GetMapping("/recruiter/job-applications")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDTO>>> getRecruiterApplications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationDTO> applications = applicationService.getRecruiterApplications(currentUser.getId(), jobId, status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Applicants list retrieved", applications));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDTO>> updateApplicationStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        ApplicationDTO updated = applicationService.updateApplicationStatus(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated to " + request.getStatus(), updated));
    }
}
