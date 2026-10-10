package com.recruito.application;

import com.recruito.application.dto.JobApplicationRequest;
import com.recruito.application.dto.JobApplicationResponse;
import com.recruito.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public JobApplicationResponse apply(@ModelAttribute JobApplicationRequest request,
                                         @AuthenticationPrincipal User applicant) {
        return applicationService.apply(request, applicant);
    }

    @GetMapping("/me")
    public List<JobApplicationResponse> myApplications(@AuthenticationPrincipal User applicant) {
        return applicationService.getMyApplications(applicant);
    }
}