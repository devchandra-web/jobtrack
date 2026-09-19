# JobTrack – Enterprise Recruitment & Job Application Management System

A full-stack recruitment portal built with **Spring Boot 3 (Java 21)**, **Spring Security 6**, **JWT Authentication**, **Spring Data JPA**, **Hibernate**, **MySQL / H2**, and **React 18 (Vite)** with **Bootstrap 5**.

---

## 🌟 Features Overview

### 👥 User Roles & Access Control
- **CANDIDATE**: Register, Login, browse/filter open jobs, view job details, apply for positions with cover letters & resumes, and track live application statuses (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
- **RECRUITER**: Register company profile, post new job requisitions, edit/delete job postings, view candidate applications per job, download/inspect resumes & cover letters, and update candidate hiring pipeline statuses.
- **ADMIN**: Access system-wide metrics dashboard, manage user directory, search users by role/status, toggle account activation (Active/Deactivate), and oversee all platform job postings.

---

## 🏗️ Project Architecture

```
jobtrack/
├── backend/                  # Spring Boot 3 Java Backend
│   ├── pom.xml               # Maven dependencies (JJWT, Security, JPA, Validation, MySQL, H2, Lombok)
│   ├── .env.example          # Environment variables template for backend
│   └── src/
│       ├── main/
│       │   ├── java/com/jobtrack/
│       │   │   ├── config/           # SecurityConfig, WebCorsConfig, DataInitializer
│       │   │   ├── controller/       # AuthController, JobController, ApplicationController, UserController, AdminController
│       │   │   ├── dto/              # Login, Register, JwtResponse, JobDTO, ApplicationDTO, PagedResponse, ApiResponse
│       │   │   ├── entity/           # User, RecruiterProfile, Job, Application, Enums (Role, JobType, ApplicationStatus)
│       │   │   ├── exception/        # ResourceNotFoundException, BadRequestException, GlobalExceptionHandler
│       │   │   ├── repository/       # UserRepository, RecruiterProfileRepository, JobRepository, ApplicationRepository
│       │   │   ├── security/         # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal, CustomUserDetailsService
│       │   │   └── service/          # AuthService, JobService, ApplicationService, UserService, RecruiterProfileService
│       │   └── resources/
│       │       ├── application.yml   # Base application configuration with env variable support
│       │       ├── application-dev.yml # Development profile (H2 in-memory db)
│       │       └── application-prod.yml# Production profile (MySQL configuration)
│       └── test/
└── frontend/                 # React 18 SPA (Vite + Bootstrap 5)
    ├── package.json          # React, React Router v6, Axios, Bootstrap 5, Bootstrap Icons
    ├── .env.example          # Environment variables template for frontend
    ├── vite.config.js
    └── src/
        ├── api/              # Centralized Axios client with JWT interceptor (`axios.js`)
        ├── components/       # Navbar, Footer, ProtectedRoute, JobCard, StatusBadge, LoadingSpinner, EmptyState, Pagination, ConfirmModal
        ├── context/          # AuthContext.jsx (Authentication state provider)
        ├── pages/            # Home, Login, Register, Jobs, JobDetails, CandidateDashboard, RecruiterDashboard, RecruiterJobs, CreateEditJob, RecruiterApplications, AdminDashboard, AdminUsers, Profile, NotFound
        ├── services/         # authService, jobService, applicationService, userService
        ├── App.jsx           # Application Router and Layout
        └── main.jsx
```

---

## 🗄️ Database Architecture (MySQL)

### Database Name: `jobtrack_db`

#### Tables & Entity Relationships

1. **`users` Table**
   - `id` (BIGINT, Primary Key, Auto-Increment)
   - `full_name` (VARCHAR(100), NOT NULL)
   - `email` (VARCHAR(100), UNIQUE, NOT NULL)
   - `password` (VARCHAR(255), NOT NULL - BCrypt Hashed)
   - `role` (VARCHAR(20), Enum: `CANDIDATE`, `RECRUITER`, `ADMIN`)
   - `status` (VARCHAR(20), Enum: `ACTIVE`, `DEACTIVATED`)
   - `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP)

2. **`recruiter_profiles` Table**
   - `id` (BIGINT, Primary Key, Auto-Increment)
   - `user_id` (BIGINT, Foreign Key → `users.id`, UNIQUE)
   - `company_name` (VARCHAR(150), NOT NULL)
   - `company_description` (TEXT)
   - `company_website` (VARCHAR(255))
   - `location` (VARCHAR(150))
   - `logo_url` (VARCHAR(255))

3. **`jobs` Table**
   - `id` (BIGINT, Primary Key, Auto-Increment)
   - `recruiter_id` (BIGINT, Foreign Key → `users.id`)
   - `title` (VARCHAR(150), NOT NULL)
   - `company_name` (VARCHAR(150), NOT NULL)
   - `location` (VARCHAR(150), NOT NULL)
   - `job_type` (VARCHAR(30), Enum: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `REMOTE`)
   - `experience_level` (VARCHAR(50))
   - `salary_range` (VARCHAR(100))
   - `description` (TEXT, NOT NULL)
   - `requirements` (TEXT)
   - `status` (VARCHAR(20), Enum: `OPEN`, `CLOSED`)
   - `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP)

4. **`applications` Table**
   - `id` (BIGINT, Primary Key, Auto-Increment)
   - `job_id` (BIGINT, Foreign Key → `jobs.id`)
   - `candidate_id` (BIGINT, Foreign Key → `users.id`)
   - `resume_url` (VARCHAR(255))
   - `cover_letter` (TEXT)
   - `status` (VARCHAR(30), Enum: `APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`)
   - `notes` (TEXT)
   - `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP)

---

## 🔑 Initial Admin Account Creation

### Method 1: Automatic System Seeding (Default)
When the Spring Boot application starts, `DataInitializer.java` automatically seeds the initial admin user if no users exist in the database:
- **Email**: `admin@jobtrack.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### Method 2: Manual MySQL SQL Seed Script
To manually seed an initial Admin account into MySQL directly:
```sql
USE jobtrack_db;

-- Insert Admin User (Password is BCrypt hash for "admin123")
INSERT INTO users (full_name, email, password, role, status, created_at, updated_at) 
VALUES (
  'System Admin',
  'admin@jobtrack.com',
  '$2a$10$e7qA39y.E43m9ZgK4/kH.e1.y5Kk91b.mG1wM7aYkQ1X0mY1aK2eG', 
  'ADMIN',
  'ACTIVE',
  NOW(),
  NOW()
);
```

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
- **Java**: 17+ (Java 21 recommended)
- **Node.js**: v18+ & **npm**
- **Maven**: 3.8+
- **MySQL**: 8.0+ (Optional: H2 in-memory DB runs automatically in `dev` profile)

---

### 1. Backend Setup & Local Execution

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Copy environment template (optional for custom envs):
   ```bash
   cp .env.example .env
   ```
3. Compile & run Spring Boot:
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```
   Backend API is available at: `http://localhost:8080/api`

---

### 2. Frontend Setup & Local Execution

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
4. Start Vite dev server:
   ```bash
   npm run dev
   ```
   Frontend App is available at: `http://localhost:5173`

---

## 🔐 Security & GitHub Environment Policy

### Critical Security Rule
Never commit sensitive credentials, API keys, JWT secrets, database passwords, or `.env` files to GitHub repository.

### Protected Files in `.gitignore`:
- `.env`, `.env.local`, `*.env`
- `target/`, `node_modules/`, `dist/`
- `.idea/`, `.vscode/`, `*.iml`
- Database credentials and connection passwords

---

## 📡 REST API Endpoint Reference

### 🔓 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Login user, returns JWT Token & User profile | Public |
| `POST` | `/auth/register` | Register new CANDIDATE or RECRUITER account | Public |
| `GET` | `/auth/me` | Get current authenticated user profile | Authenticated |

### 💼 Jobs (`/api/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/jobs` | Search & filter jobs (query, location, jobType, status) | Public |
| `GET` | `/jobs/{id}` | Get detailed job details by ID | Public |
| `GET` | `/jobs/recruiter/posted` | Get jobs posted by logged-in recruiter | Recruiter / Admin |
| `POST` | `/jobs` | Post new job requisition | Recruiter / Admin |
| `PUT` | `/jobs/{id}` | Update job posting | Recruiter (Owner) / Admin |
| `DELETE` | `/jobs/{id}` | Delete job posting | Recruiter (Owner) / Admin |

### 📝 Applications (`/api/applications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/applications/apply` | Apply for a job position | Candidate / Admin |
| `GET` | `/applications/candidate/my-applications` | Candidate's applied jobs history | Candidate / Admin |
| `GET` | `/applications/recruiter/job-applications` | Applicants for recruiter's jobs | Recruiter / Admin |
| `PUT` | `/applications/{id}/status` | Update applicant hiring status & notes | Recruiter (Owner) / Admin |

### 🛡️ Admin & User Management (`/api/admin`, `/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard-stats` | Platform-wide metrics summary | Admin |
| `GET` | `/admin/users` | User directory with role/status filters | Admin |
| `PUT` | `/admin/users/{id}/status` | Toggle user active/deactivated status | Admin |
| `PUT` | `/users/profile` | Update profile & company details | Authenticated |

---

## 🚀 Production Deployment Documentation

### Step 1: Deploy MySQL Database
1. Provision a managed MySQL database instance (e.g., AWS RDS, Railway, Aiven, or PlanetScale).
2. Create database: `CREATE DATABASE jobtrack_db;`
3. Save connection parameters:
   - Host / Port: `db.example.com:3306`
   - Database: `jobtrack_db`
   - User: `jobtrack_admin`
   - Password: `YourSecurePassword`

### Step 2: Deploy Spring Boot Backend (Render / Railway / AWS / Docker)
1. Set Environment Variables in deployment platform dashboard:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://db.example.com:3306/jobtrack_db?useSSL=true&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: `jobtrack_admin`
   - `SPRING_DATASOURCE_PASSWORD`: `YourSecurePassword`
   - `JWT_SECRET`: `your_secure_64_character_hex_secret_key`
   - `CORS_ALLOWED_ORIGINS`: `https://jobtrack-app.vercel.app`
2. Build command: `mvn clean package -DskipTests`
3. Run command: `java -jar target/backend-1.0.0.jar`

### Step 3: Deploy React Frontend (Vercel / Netlify / Cloudflare Pages)
1. Connect GitHub repository to Vercel/Netlify.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Configure Production Environment Variable:
   - `VITE_API_URL`: `https://jobtrack-backend.onrender.com/api`
6. Deploy site.

---

## 🧪 Post-Deployment Verification Checklist

After deploying all services, verify end-to-end functionality:

1. **User Registration**: Register a new Candidate account and a Recruiter account.
2. **Authentication & JWT**: Log in with credentials, check that JWT bearer token is stored in `localStorage` and attached to outgoing requests.
3. **Role-Based Authorization**:
   - Verify Candidates cannot access `/recruiter/dashboard` or `/admin/dashboard`.
   - Verify Recruiters can access job creation forms.
   - Verify Admins can toggle user account statuses.
4. **Job Posting**: Recruiter creates a job posting.
5. **Job Discovery**: Candidate searches for the newly posted job.
6. **Application Workflow**: Candidate submits job application with cover letter.
7. **Pipeline Update**: Recruiter moves application status from `APPLIED` to `SHORTLISTED` and `INTERVIEW`.
8. **Dashboards**: Confirm stats reflect in Candidate, Recruiter, and Admin dashboards.
