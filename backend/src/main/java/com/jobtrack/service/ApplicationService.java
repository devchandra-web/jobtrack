package com.jobtrack.service;

import com.jobtrack.dto.ApplicationDTO;
import com.jobtrack.dto.ApplicationRequest;
import com.jobtrack.dto.ApplicationStatusUpdateRequest;
import com.jobtrack.dto.PagedResponse;
import com.jobtrack.entity.*;
import com.jobtrack.exception.BadRequestException;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.exception.UnauthorizedException;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.JobRepository;
import com.jobtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public ApplicationDTO applyForJob(Long candidateId, ApplicationRequest request) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateId));

        if (candidate.getRole() != Role.CANDIDATE && candidate.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only candidates can apply for jobs.");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new BadRequestException("This job listing is closed and no longer accepting applications.");
        }

        if (applicationRepository.existsByJobIdAndCandidateId(job.getId(), candidateId)) {
            throw new BadRequestException("You have already applied for this job.");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .resumeUrl(request.getResumeUrl())
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.APPLIED)
                .build();

        Application saved = applicationRepository.save(application);
        return ApplicationDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDTO> getCandidateApplications(Long candidateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByCandidateId(candidateId, pageable);
        return PagedResponse.fromPageMapped(applications, applications.getContent().stream().map(ApplicationDTO::fromEntity).toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDTO> getRecruiterApplications(Long recruiterId, Long jobId, ApplicationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.searchRecruiterApplications(recruiterId, jobId, status, pageable);
        return PagedResponse.fromPageMapped(applications, applications.getContent().stream().map(ApplicationDTO::fromEntity).toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDTO> getAllApplicationsForAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findAll(pageable);
        return PagedResponse.fromPageMapped(applications, applications.getContent().stream().map(ApplicationDTO::fromEntity).toList());
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Long applicationId, Long recruiterId, ApplicationStatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        User user = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        // Security check: must be job owner recruiter or admin
        if (!application.getJob().getRecruiter().getId().equals(recruiterId) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only manage applications for your own job postings.");
        }

        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        Application updated = applicationRepository.save(application);
        return ApplicationDTO.fromEntity(updated);
    }
}
