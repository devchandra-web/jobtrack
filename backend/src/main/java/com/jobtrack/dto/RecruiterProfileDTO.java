package com.jobtrack.dto;

import com.jobtrack.entity.RecruiterProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterProfileDTO {
    private Long id;
    private Long userId;
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String location;
    private String logoUrl;

    public static RecruiterProfileDTO fromEntity(RecruiterProfile profile) {
        if (profile == null) return null;
        return RecruiterProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .companyName(profile.getCompanyName())
                .companyDescription(profile.getCompanyDescription())
                .companyWebsite(profile.getCompanyWebsite())
                .location(profile.getLocation())
                .logoUrl(profile.getLogoUrl())
                .build();
    }
}
