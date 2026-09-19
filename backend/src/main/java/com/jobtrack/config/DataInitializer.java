package com.jobtrack.config;

import com.jobtrack.entity.*;
import com.jobtrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Seeding initial data for JobTrack system...");

            // 1. Create Admin
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@jobtrack.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);

            // 2. Create Recruiters
            User recruiter1 = User.builder()
                    .fullName("Sarah Jenkins")
                    .email("sarah@techcorp.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(Role.RECRUITER)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(recruiter1);

            RecruiterProfile profile1 = RecruiterProfile.builder()
                    .user(recruiter1)
                    .companyName("TechCorp Solutions")
                    .companyDescription("Leading global cloud and AI software consultancy based in San Francisco & Bangalore.")
                    .companyWebsite("https://techcorp.example.com")
                    .location("San Francisco, CA / Hybrid")
                    .logoUrl("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80")
                    .build();
            recruiterProfileRepository.save(profile1);

            User recruiter2 = User.builder()
                    .fullName("David Miller")
                    .email("david@innovatex.io")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(Role.RECRUITER)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(recruiter2);

            RecruiterProfile profile2 = RecruiterProfile.builder()
                    .user(recruiter2)
                    .companyName("InnovateX Labs")
                    .companyDescription("Next-generation fintech startup revolutionizing cross-border digital payments.")
                    .companyWebsite("https://innovatex.example.com")
                    .location("New York, NY / Remote")
                    .logoUrl("https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80")
                    .build();
            recruiterProfileRepository.save(profile2);

            // 3. Create Candidates
            User candidate1 = User.builder()
                    .fullName("Alex Rivera")
                    .email("alex@candidate.com")
                    .password(passwordEncoder.encode("candidate123"))
                    .role(Role.CANDIDATE)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(candidate1);

            User candidate2 = User.builder()
                    .fullName("Priya Sharma")
                    .email("priya@candidate.com")
                    .password(passwordEncoder.encode("candidate123"))
                    .role(Role.CANDIDATE)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(candidate2);

            // 4. Create Jobs
            Job job1 = Job.builder()
                    .recruiter(recruiter1)
                    .title("Senior Full Stack Java Developer")
                    .companyName("TechCorp Solutions")
                    .location("San Francisco, CA / Remote")
                    .jobType(JobType.FULL_TIME)
                    .experienceLevel("Senior (4-7 yrs)")
                    .salaryRange("$120,000 - $150,000 / year")
                    .description("We are seeking an experienced Java Full Stack Developer to build resilient, distributed RESTful microservices with Spring Boot 3, Hibernate, and React 18 frontend interfaces.")
                    .requirements("• 4+ years Java & Spring Boot experience\n• Proficiency with React, REST APIs, and MySQL\n• Experience with Docker and AWS cloud deployments")
                    .status(JobStatus.OPEN)
                    .build();

            Job job2 = Job.builder()
                    .recruiter(recruiter1)
                    .title("Frontend React Developer")
                    .companyName("TechCorp Solutions")
                    .location("Austin, TX / Hybrid")
                    .jobType(JobType.FULL_TIME)
                    .experienceLevel("Mid-Level (2-4 yrs)")
                    .salaryRange("$95,000 - $115,000 / year")
                    .description("Join our dynamic core web platform team to craft fluid responsive web applications utilizing modern JavaScript, React Context API, Bootstrap 5, and state management tools.")
                    .requirements("• 2+ years commercial React.js development\n• High mastery of CSS3, Bootstrap 5, dynamic layouts\n• Strong familiarity with Axios, web performance, and REST integration")
                    .status(JobStatus.OPEN)
                    .build();

            Job job3 = Job.builder()
                    .recruiter(recruiter2)
                    .title("Backend Spring Boot Engineer")
                    .companyName("InnovateX Labs")
                    .location("New York, NY / Remote")
                    .jobType(JobType.CONTRACT)
                    .experienceLevel("Mid-Level (3+ yrs)")
                    .salaryRange("$80 - $100 / hour")
                    .description("Lead the design of secure high-throughput financial transactions processing engines using Java 21, Spring Security JWT, Spring Data JPA, and PostgreSQL/MySQL database clusters.")
                    .requirements("• Strong knowledge of Spring Security & JWT Auth\n• Database indexing, JPA query optimization\n• Microservices design patterns")
                    .status(JobStatus.OPEN)
                    .build();

            Job job4 = Job.builder()
                    .recruiter(recruiter2)
                    .title("Junior DevOps & QA Specialist")
                    .companyName("InnovateX Labs")
                    .location("Remote")
                    .jobType(JobType.PART_TIME)
                    .experienceLevel("Entry Level (0-2 yrs)")
                    .salaryRange("$50,000 - $65,000 / year")
                    .description("Assist our platform engineering team in maintaining GitHub Actions CI/CD pipelines, automated testing, and cloud infrastructure monitoring.")
                    .requirements("• Familiarity with Linux shell, Git, and Docker\n• Basic scripting in Python or Bash\n• Eagerness to learn DevOps best practices")
                    .status(JobStatus.OPEN)
                    .build();

            jobRepository.saveAll(List.of(job1, job2, job3, job4));

            // 5. Create Sample Applications
            Application app1 = Application.builder()
                    .job(job1)
                    .candidate(candidate1)
                    .resumeUrl("https://example.com/resumes/alex-rivera-java-dev.pdf")
                    .coverLetter("Dear Hiring Team,\nI have over 4 years of experience crafting enterprise Java Spring Boot backend APIs and React single page applications. I would love to contribute to TechCorp's mission!")
                    .status(ApplicationStatus.SHORTLISTED)
                    .notes("Candidate passed technical resume screening. Scheduling initial technical phone interview.")
                    .build();

            Application app2 = Application.builder()
                    .job(job3)
                    .candidate(candidate2)
                    .resumeUrl("https://example.com/resumes/priya-sharma-backend.pdf")
                    .coverLetter("Hi InnovateX team,\nAs a backend specialist with deep experience in Spring Security JWT and financial databases, this contract role is a perfect match for my skill set.")
                    .status(ApplicationStatus.APPLIED)
                    .build();

            applicationRepository.saveAll(List.of(app1, app2));

            logger.info("Data initialization complete! Demo accounts created:");
            logger.info("Admin: admin@jobtrack.com / admin123");
            logger.info("Recruiter: sarah@techcorp.com / recruiter123");
            logger.info("Candidate: alex@candidate.com / candidate123");
        }
    }
}
