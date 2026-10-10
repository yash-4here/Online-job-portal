package com.recruito.job.dto;

import com.recruito.job.Job;
import com.recruito.job.JobStatus;
import java.time.Instant;

public class JobResponse {
    private Long id;
    private String title, companyName, location, employmentType, department,
            salary, description, requiredSkills, education, experience, industry;
    private JobStatus status;
    private Instant createdAt;

    public JobResponse(Job j) {
        this.id = j.getId();
        this.title = j.getTitle();
        this.companyName = j.getCompanyName();
        this.location = j.getLocation();
        this.employmentType = j.getEmploymentType();
        this.department = j.getDepartment();
        this.salary = j.getSalary();
        this.description = j.getDescription();
        this.requiredSkills = j.getRequiredSkills();
        this.education = j.getEducation();
        this.experience = j.getExperience();
        this.industry = j.getIndustry();
        this.status = j.getStatus();
        this.createdAt = j.getCreatedAt();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCompanyName() { return companyName; }
    public String getLocation() { return location; }
    public String getEmploymentType() { return employmentType; }
    public String getDepartment() { return department; }
    public String getSalary() { return salary; }
    public String getDescription() { return description; }
    public String getRequiredSkills() { return requiredSkills; }
    public String getEducation() { return education; }
    public String getExperience() { return experience; }
    public String getIndustry() { return industry; }
    public JobStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}