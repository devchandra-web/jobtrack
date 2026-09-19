package com.jobtrack.dto;

import com.jobtrack.entity.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserStatusUpdateRequest {

    @NotNull(message = "User status is required")
    private UserStatus status;
}
