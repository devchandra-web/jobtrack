package com.jobtrack.service;

import com.jobtrack.dto.*;
import com.jobtrack.entity.RecruiterProfile;
import com.jobtrack.entity.Role;
import com.jobtrack.entity.User;
import com.jobtrack.entity.UserStatus;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.JobRepository;
import com.jobtrack.repository.RecruiterProfileRepository;
import com.jobtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserDTO.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDTO> getAllUsers(Role role, UserStatus status, String query, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> users = userRepository.searchUsers(role, status, query, pageable);
        return PagedResponse.fromPageMapped(users, users.getContent().stream().map(UserDTO::fromEntity).toList());
    }

    @Transactional
    public UserDTO updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setStatus(status);
        User updated = userRepository.save(user);
        return UserDTO.fromEntity(updated);
    }

    @Transactional
    public UserDTO updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setFullName(request.getFullName().trim());
        User updatedUser = userRepository.save(user);

        if (user.getRole() == Role.RECRUITER) {
            RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                    .orElseGet(() -> RecruiterProfile.builder().user(user).build());

            if (request.getCompanyName() != null) profile.setCompanyName(request.getCompanyName().trim());
            if (request.getCompanyDescription() != null) profile.setCompanyDescription(request.getCompanyDescription());
            if (request.getCompanyWebsite() != null) profile.setCompanyWebsite(request.getCompanyWebsite());
            if (request.getLocation() != null) profile.setLocation(request.getLocation());
            if (request.getLogoUrl() != null) profile.setLogoUrl(request.getLogoUrl());

            recruiterProfileRepository.save(profile);
        }

        return UserDTO.fromEntity(updatedUser);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole(Role.CANDIDATE);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        Map<String, Long> appStatusMap = new HashMap<>();
        for (var status : com.jobtrack.entity.ApplicationStatus.values()) {
            appStatusMap.put(status.name(), applicationRepository.countByStatus(status));
        }

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalRecruiters(totalRecruiters)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .applicationsByStatus(appStatusMap)
                .build();
    }
}
