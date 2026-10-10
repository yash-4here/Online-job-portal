package com.recruito.job;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByEmployerId(Long employerId);
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);
}