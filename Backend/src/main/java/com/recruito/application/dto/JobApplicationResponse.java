package com.recruito.application.dto;

import com.recruito.application.ApplicationStatus;
import java.time.Instant;

public class JobApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private ApplicationStatus status;
    private Instant appliedAt;

    public JobApplicationResponse(Long id, Long jobId, String jobTitle, String company, ApplicationStatus status, Instant appliedAt) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public Long getId() { return id; }
    public Long getJobId() { return jobId; }
    public String getJobTitle() { return jobTitle; }
    public String getCompany() { return company; }
    public ApplicationStatus getStatus() { return status; }
    public Instant getAppliedAt() { return appliedAt; }
}