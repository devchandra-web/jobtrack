package com.jobtrack.controller;

import com.jobtrack.dto.ApiResponse;
import com.jobtrack.dto.ProfileUpdateRequest;
import com.jobtrack.dto.RecruiterProfileDTO;
import com.jobtrack.dto.UserDTO;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.RecruiterProfileService;
import com.jobtrack.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RecruiterProfileService recruiterProfileService;

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                             @Valid @RequestBody ProfileUpdateRequest request) {
        UserDTO updated = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/recruiter-profile/{userId}")
    public ResponseEntity<ApiResponse<RecruiterProfileDTO>> getRecruiterProfile(@PathVariable Long userId) {
        RecruiterProfileDTO profile = recruiterProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile retrieved", profile));
    }
}
