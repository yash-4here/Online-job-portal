package com.recruito.job;

import com.recruito.job.dto.JobRequest;
import com.recruito.job.dto.JobResponse;
import com.recruito.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) { this.jobService = jobService; }

    @PostMapping("/jobs")
    public JobResponse create(@RequestBody JobRequest request, @AuthenticationPrincipal User employer) {
        return jobService.createJob(request, employer);
    }

    @GetMapping("/jobs")
    public List<JobResponse> list() { return jobService.getActiveJobs(); }

    @GetMapping("/jobs/{id}")
    public JobResponse getOne(@PathVariable Long id) { return jobService.getJob(id); }

    @GetMapping("/employer/jobs")
    public List<JobResponse> myJobs(@AuthenticationPrincipal User employer) { return jobService.getMyJobs(employer); }

    @DeleteMapping("/jobs/{id}")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User employer) {
        jobService.deleteJob(id, employer);
    }

    @PutMapping("/jobs/{id}")
    public JobResponse update(@PathVariable Long id, @RequestBody JobRequest request, @AuthenticationPrincipal User employer) {
    return jobService.updateJob(id, request, employer);
    }
}