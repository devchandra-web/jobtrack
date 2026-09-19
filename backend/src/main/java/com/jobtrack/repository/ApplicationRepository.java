package com.jobtrack.repository;

import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    Page<Application> findByCandidateId(Long candidateId, Pageable pageable);

    List<Application> findByCandidateId(Long candidateId);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    List<Application> findByJobId(Long jobId);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId")
    Page<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId AND (:jobId IS NULL OR a.job.id = :jobId) AND (:status IS NULL OR a.status = :status)")
    Page<Application> searchRecruiterApplications(@Param("recruiterId") Long recruiterId,
                                                   @Param("jobId") Long jobId,
                                                   @Param("status") ApplicationStatus status,
                                                   Pageable pageable);

    long countByCandidateId(Long candidateId);

    long countByJobRecruiterId(Long recruiterId);

    long countByStatus(ApplicationStatus status);
}
