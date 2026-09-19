import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getJobs({ page: 0, size: 6, status: 'OPEN' });
        if (response.success && response.data) {
          setFeaturedJobs(response.data.content);
        }
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('query', searchQuery);
    if (locationQuery) queryParams.set('location', locationQuery);
    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-md-start">
        <div className="container position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill fw-bold mb-3">
                <i className="bi bi-stars me-1"></i> Leading Recruitment Portal
              </span>
              <h1 className="hero-title display-4 text-white mb-3">
                Find Your Dream Job or Hire Exceptional Talent.
              </h1>
              <p className="hero-subtitle mb-4">
                JobTrack connects high-performing software engineers, product leaders, and enterprises seamlessly with real-time application tracking.
              </p>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="bg-white p-3 rounded-4 shadow-lg mb-4 text-dark">
                <div className="row g-2">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Job title, keyword, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 border-start border-md">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Location or Remote"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-primary-custom w-100 h-100 py-2">
                      Search Jobs
                    </button>
                  </div>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-4 text-slate-300 small">
                <div><i className="bi bi-check-circle-fill text-success me-1"></i> Verified Recruiters</div>
                <div><i className="bi bi-check-circle-fill text-success me-1"></i> Direct Application Tracking</div>
                <div><i className="bi bi-check-circle-fill text-success me-1"></i> 100% Free for Job Seekers</div>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="p-4 bg-slate-800 border border-slate-700 rounded-4 shadow-2xl">
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                  <div>
                    <h6 className="text-white mb-0 fw-bold">Live Hiring Overview</h6>
                    <small className="text-muted">Real-time system statistics</small>
                  </div>
                  <span className="badge bg-success text-white">Live Data</span>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 bg-slate-900 rounded-3 text-start border border-slate-700">
                      <div className="text-primary fs-3 fw-bold">500+</div>
                      <div className="text-slate-400 small">Active Jobs</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-slate-900 rounded-3 text-start border border-slate-700">
                      <div className="text-success fs-3 fw-bold">98%</div>
                      <div className="text-slate-400 small">Response Rate</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-slate-900 rounded-3 text-start border border-slate-700">
                      <div className="text-warning fs-3 fw-bold">1,200+</div>
                      <div className="text-slate-400 small">Candidates</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-slate-900 rounded-3 text-start border border-slate-700">
                      <div className="text-purple fs-3 fw-bold">150+</div>
                      <div className="text-slate-400 small">Companies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-5">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Featured Job Opportunities</h2>
              <p className="text-muted mb-0">Explore recently posted opportunities from top tech companies.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-custom">
              View All Jobs <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching open positions..." />
          ) : (
            <div className="row g-4">
              {featuredJobs.map((job) => (
                <div key={job.id} className="col-md-6 col-lg-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Role Feature Highlights */}
      <section className="bg-light py-5 border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-lg mx-auto mb-5">
            <h2 className="fw-bold text-dark">Built for Everyone in the Hiring Process</h2>
            <p className="text-muted">A streamlined experience tailored specifically for candidates, recruiters, and administrators.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                <div className="stat-icon bg-primary-subtle text-primary mx-auto mb-3">
                  <i className="bi bi-person-workspace"></i>
                </div>
                <h5 className="fw-bold">For Candidates</h5>
                <p className="text-muted small mb-4">
                  Search filtered job listings, submit one-click applications, and track your application status (Shortlisted, Interview, Selected) in real-time.
                </p>
                <Link to="/register" className="btn btn-sm btn-outline-custom mt-auto">Create Candidate Profile</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                <div className="stat-icon bg-success-subtle text-success mx-auto mb-3">
                  <i className="bi bi-building"></i>
                </div>
                <h5 className="fw-bold">For Recruiters</h5>
                <p className="text-muted small mb-4">
                  Post new job requirements, manage candidate profiles, review cover letters & resumes, and update hiring pipeline status effortlessly.
                </p>
                <Link to="/register" className="btn btn-sm btn-outline-custom mt-auto">Post Jobs Now</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                <div className="stat-icon bg-warning-subtle text-warning mx-auto mb-3">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="fw-bold">For Admins</h5>
                <p className="text-muted small mb-4">
                  Complete platform governance: monitor active users, manage user statuses (Active/Deactivate), oversee all job listings, and analyze stats.
                </p>
                <Link to="/login" className="btn btn-sm btn-outline-custom mt-auto">Admin Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
