package com.jobtrack.service;

import com.jobtrack.dto.JobDTO;
import com.jobtrack.dto.JobRequest;
import com.jobtrack.dto.PagedResponse;
import com.jobtrack.entity.Job;
import com.jobtrack.entity.JobStatus;
import com.jobtrack.entity.JobType;
import com.jobtrack.entity.Role;
import com.jobtrack.entity.User;
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
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public PagedResponse<JobDTO> getJobs(String query, String location, JobType jobType, JobStatus status,
                                         int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Job> jobs = jobRepository.searchJobs(query, location, jobType, status, pageable);

        return PagedResponse.fromPageMapped(jobs, jobs.getContent().stream()
                .map(job -> {
                    long count = applicationRepository.findByJobId(job.getId()).size();
                    return JobDTO.fromEntity(job, count);
                }).toList());
    }

    @Transactional(readOnly = true)
    public JobDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        long count = applicationRepository.findByJobId(job.getId()).size();
        return JobDTO.fromEntity(job, count);
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobDTO> getRecruiterJobs(Long recruiterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findByRecruiterId(recruiterId, pageable);
        return PagedResponse.fromPageMapped(jobs, jobs.getContent().stream()
                .map(job -> {
                    long count = applicationRepository.findByJobId(job.getId()).size();
                    return JobDTO.fromEntity(job, count);
                }).toList());
    }

    @Transactional
    public JobDTO createJob(Long recruiterId, JobRequest request) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only recruiters and admins can post jobs.");
        }

        Job job = Job.builder()
                .recruiter(recruiter)
                .title(request.getTitle().trim())
                .companyName(request.getCompanyName().trim())
                .location(request.getLocation().trim())
                .jobType(request.getJobType())
                .experienceLevel(request.getExperienceLevel())
                .salaryRange(request.getSalaryRange())
                .description(request.getDescription().trim())
                .requirements(request.getRequirements())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN)
                .build();

        Job saved = jobRepository.save(job);
        return JobDTO.fromEntity(saved, 0);
    }

    @Transactional
    public JobDTO updateJob(Long jobId, Long userId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!job.getRecruiter().getId().equals(userId) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only edit jobs you posted.");
        }

        job.setTitle(request.getTitle().trim());
        job.setCompanyName(request.getCompanyName().trim());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        if (request.getExperienceLevel() != null) job.setExperienceLevel(request.getExperienceLevel());
        if (request.getSalaryRange() != null) job.setSalaryRange(request.getSalaryRange());
        job.setDescription(request.getDescription().trim());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        Job updated = jobRepository.save(job);
        long count = applicationRepository.findByJobId(updated.getId()).size();
        return JobDTO.fromEntity(updated, count);
    }

    @Transactional
    public void deleteJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!job.getRecruiter().getId().equals(userId) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only delete jobs you posted.");
        }

        jobRepository.delete(job);
    }
}
