package com.jobtrack.controller;

import com.jobtrack.dto.*;
import com.jobtrack.entity.Role;
import com.jobtrack.entity.UserStatus;
import com.jobtrack.service.ApplicationService;
import com.jobtrack.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ApplicationService applicationService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDTO>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PagedResponse<UserDTO> users = userService.getAllUsers(role, status, query, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Users list retrieved", users));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        UserDTO updated = userService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("User status updated to " + request.getStatus(), updated));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = userService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics retrieved", stats));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDTO>>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationDTO> applications = applicationService.getAllApplicationsForAdmin(page, size);
        return ResponseEntity.ok(ApiResponse.success("All system applications retrieved", applications));
    }
}
