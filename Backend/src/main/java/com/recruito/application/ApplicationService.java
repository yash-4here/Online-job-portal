package com.recruito.application;

import com.recruito.application.dto.JobApplicationRequest;
import com.recruito.application.dto.JobApplicationResponse;
import com.recruito.user.Role;
import com.recruito.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final JobApplicationRepository repository;

    @Value("${recruito.upload.dir}")
    private String uploadDir;

    public ApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public JobApplicationResponse apply(JobApplicationRequest request, User applicant) {
        if (applicant.getRole() != Role.APPLICANT) {
            throw new IllegalArgumentException("Only job seekers can apply for jobs");
        }
        if (repository.existsByApplicantIdAndJobId(applicant.getId(), request.getJobId())) {
            throw new IllegalArgumentException("You have already applied to this job");
        }
        MultipartFile resume = request.getResume();
        if (resume == null || resume.isEmpty()) {
            throw new IllegalArgumentException("Resume file is required");
        }
        String original = resume.getOriginalFilename();
        if (original == null || !(original.toLowerCase().endsWith(".pdf")
                || original.toLowerCase().endsWith(".doc") || original.toLowerCase().endsWith(".docx"))) {
            throw new IllegalArgumentException("Resume must be a PDF or Word document");
        }

        String storedFileName = storeResume(resume);

        JobApplication app = new JobApplication();
        app.setApplicant(applicant);
        app.setJobId(request.getJobId());
        app.setJobTitle(request.getJobTitle());
        app.setCompany(request.getCompany());
        app.setFullName(request.getFullName());
        app.setEmail(request.getEmail());
        app.setPhone(request.getPhone());
        app.setQualifications(request.getQualifications());
        app.setSkills(request.getSkills());
        app.setCertificateFileNames(storeCertificates(request.getCertificates()));
        app.setLinkedinUrl(request.getLinkedinUrl());
        app.setGithubUrl(request.getGithubUrl());
        app.setPortfolioUrl(request.getPortfolioUrl());
        app.setResumeFileName(storedFileName);

        repository.save(app);
        return toResponse(app);
    }

    public List<JobApplicationResponse> getMyApplications(User applicant) {
        return repository.findByApplicantId(applicant.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String storeResume(MultipartFile file) {
    return storeFile(file, "resumes");
}

    private String storeFile(MultipartFile file, String subDir) {
    try {
        Path dir = Paths.get(uploadDir).resolveSibling(subDir);
        Files.createDirectories(dir);
        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) ext = original.substring(original.lastIndexOf('.'));
        String fileName = UUID.randomUUID() + ext;
        Files.copy(file.getInputStream(), dir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    } catch (IOException e) {
        throw new RuntimeException("Failed to store file", e);
    }
}

    private JobApplicationResponse toResponse(JobApplication app) {
        return new JobApplicationResponse(app.getId(), app.getJobId(), app.getJobTitle(),
                app.getCompany(), app.getStatus(), app.getAppliedAt());
    }

    private String storeCertificates(List<MultipartFile> files) {
    if (files == null || files.isEmpty()) return null;
    List<String> stored = new ArrayList<>();
    for (MultipartFile file : files) {
        if (file == null || file.isEmpty()) continue;
        String original = file.getOriginalFilename();
        String lower = original != null ? original.toLowerCase() : "";
        if (!(lower.endsWith(".pdf") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png"))) {
            throw new IllegalArgumentException("Certificates must be PDF, JPG, or PNG files");
        }
        stored.add(storeFile(file, "certificates"));
    }
    return String.join(",", stored);
    }

}