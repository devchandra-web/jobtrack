package com.jobtrack.controller;

import com.jobtrack.dto.ApiResponse;
import com.jobtrack.dto.JobDTO;
import com.jobtrack.dto.JobRequest;
import com.jobtrack.dto.PagedResponse;
import com.jobtrack.entity.JobStatus;
import com.jobtrack.entity.JobType;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobDTO>>> getJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PagedResponse<JobDTO> jobs = jobService.getJobs(query, location, jobType, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved successfully", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDTO>> getJobById(@PathVariable Long id) {
        JobDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success("Job details retrieved", job));
    }

    @GetMapping("/recruiter/posted")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<JobDTO>>> getRecruiterJobs(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobDTO> jobs = jobService.getRecruiterJobs(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Posted jobs retrieved", jobs));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobDTO>> createJob(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody JobRequest request) {
        JobDTO created = jobService.createJob(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job posted successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobDTO>> updateJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody JobRequest request) {
        JobDTO updated = jobService.updateJob(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        jobService.deleteJob(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully"));
    }
}
