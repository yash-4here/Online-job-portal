package com.recruito.job;

import com.recruito.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "jobs")
public class Job {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    @Column(nullable = false) private String title;
    @Column(nullable = false) private String companyName;
    @Column(nullable = false) private String location;
    private String employmentType;
    private String department;
    private String salary;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(columnDefinition = "TEXT") private String requiredSkills;
    private String education;
    private String experience;
    private String industry;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Job() {}

    public Long getId() { return id; }
    public User getEmployer() { return employer; }
    public void setEmployer(User employer) { this.employer = employer; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
}