package com.recruito.job;

import com.recruito.job.dto.JobRequest;
import com.recruito.job.dto.JobResponse;
import com.recruito.user.Role;
import com.recruito.user.User;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository repository;

    public JobService(JobRepository repository) { this.repository = repository; }

    public JobResponse createJob(JobRequest request, User employer) {
        if (employer.getRole() != Role.EMPLOYER) {
            throw new IllegalArgumentException("Only employers can post jobs");
        }
        Job job = new Job();
        job.setEmployer(employer);
        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setDepartment(request.getDepartment());
        job.setSalary(request.getSalary());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setEducation(request.getEducation());
        job.setExperience(request.getExperience());
        job.setIndustry(request.getIndustry());
        repository.save(job);
        return new JobResponse(job);
    }

    public List<JobResponse> getActiveJobs() {
        return repository.findByStatusOrderByCreatedAtDesc(JobStatus.ACTIVE).stream().map(JobResponse::new).collect(Collectors.toList());
    }

    public JobResponse getJob(Long id) {
        return repository.findById(id).map(JobResponse::new)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public List<JobResponse> getMyJobs(User employer) {
        return repository.findByEmployerId(employer.getId()).stream().map(JobResponse::new).collect(Collectors.toList());
    }

    public void deleteJob(Long id, User employer) {
        Job job = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new IllegalArgumentException("You can only delete your own jobs");
        }
        repository.delete(job);
    }


    public JobResponse updateJob(Long id, JobRequest request, User employer) {
    Job job = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    if (!job.getEmployer().getId().equals(employer.getId())) {
        throw new IllegalArgumentException("You can only edit your own jobs");
    }
    job.setTitle(request.getTitle());
    job.setCompanyName(request.getCompanyName());
    job.setLocation(request.getLocation());
    job.setEmploymentType(request.getEmploymentType());
    job.setDepartment(request.getDepartment());
    job.setSalary(request.getSalary());
    job.setDescription(request.getDescription());
    job.setRequiredSkills(request.getRequiredSkills());
    job.setEducation(request.getEducation());
    job.setExperience(request.getExperience());
    job.setIndustry(request.getIndustry());
    repository.save(job);
    return new JobResponse(job);
    }
}