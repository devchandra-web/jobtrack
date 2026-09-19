package com.jobtrack.service;

import com.jobtrack.dto.RecruiterProfileDTO;
import com.jobtrack.entity.RecruiterProfile;
import com.jobtrack.entity.User;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.repository.RecruiterProfileRepository;
import com.jobtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public RecruiterProfileDTO getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElse(null);
        return RecruiterProfileDTO.fromEntity(profile);
    }
}
