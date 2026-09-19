package com.jobtrack.service;

import com.jobtrack.dto.JwtResponse;
import com.jobtrack.dto.LoginRequest;
import com.jobtrack.dto.RegisterRequest;
import com.jobtrack.dto.UserDTO;
import com.jobtrack.entity.RecruiterProfile;
import com.jobtrack.entity.Role;
import com.jobtrack.entity.User;
import com.jobtrack.entity.UserStatus;
import com.jobtrack.exception.BadRequestException;
import com.jobtrack.repository.RecruiterProfileRepository;
import com.jobtrack.repository.UserRepository;
import com.jobtrack.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BadRequestException("Account is deactivated. Please contact administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail().trim().toLowerCase(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return JwtResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .user(UserDTO.fromEntity(user))
                .build();
    }

    @Transactional
    public UserDTO register(RegisterRequest registerRequest) {
        String cleanEmail = registerRequest.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("Email address is already in use.");
        }

        if (registerRequest.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot register directly as ADMIN.");
        }

        User user = User.builder()
                .fullName(registerRequest.getFullName().trim())
                .email(cleanEmail)
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // If registering as a recruiter, create profile
        if (registerRequest.getRole() == Role.RECRUITER) {
            RecruiterProfile profile = RecruiterProfile.builder()
                    .user(savedUser)
                    .companyName(registerRequest.getCompanyName() != null ? registerRequest.getCompanyName().trim() : savedUser.getFullName() + "'s Company")
                    .companyDescription(registerRequest.getCompanyDescription())
                    .companyWebsite(registerRequest.getCompanyWebsite())
                    .location(registerRequest.getLocation() != null ? registerRequest.getLocation() : "Remote / Hybrid")
                    .build();
            recruiterProfileRepository.save(profile);
        }

        return UserDTO.fromEntity(savedUser);
    }
}
