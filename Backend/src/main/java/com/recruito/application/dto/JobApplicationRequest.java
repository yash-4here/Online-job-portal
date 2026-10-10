package com.recruito.application.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class JobApplicationRequest {
    private Long jobId;
    private String jobTitle;
    private String company;
    private String fullName;
    private String email;
    private String phone;
    private String qualifications;
    private String skills;
    private List<MultipartFile> certificates;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private MultipartFile resume;

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public List<MultipartFile> getCertificates() { return certificates; }
    public void setCertificates(List<MultipartFile> certificates) { this.certificates = certificates; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }
    public MultipartFile getResume() { return resume; }
    public void setResume(MultipartFile resume) { this.resume = resume; }
}