package com.jobtrack.repository;

import com.jobtrack.entity.Job;
import com.jobtrack.entity.JobStatus;
import com.jobtrack.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);

    List<Job> findByRecruiterId(Long recruiterId);

    long countByRecruiterId(Long recruiterId);

    long countByStatus(JobStatus status);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:query IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(j.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Job> searchJobs(@Param("query") String query,
                         @Param("location") String location,
                         @Param("jobType") JobType jobType,
                         @Param("status") JobStatus status,
                         Pageable pageable);
}
