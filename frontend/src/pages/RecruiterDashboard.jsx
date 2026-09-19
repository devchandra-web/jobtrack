import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await jobService.getRecruiterJobs(0, 5);
        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data.content);
        }

        const appsRes = await applicationService.getRecruiterApplications({ page: 0, size: 5 });
        if (appsRes.success && appsRes.data) {
          setApplications(appsRes.data.content);
        }
      } catch (err) {
        console.error('Recruiter dashboard data fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openJobsCount = jobs.filter((j) => j.status === 'OPEN').length;

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Recruiter Dashboard</h2>
          <p className="text-muted mb-0">Overview of your posted job requisitions and candidate applications.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn btn-primary-custom">
          <i className="bi bi-plus-lg me-1"></i> Post New Job
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-lg-4">
          <div className="stat-card">
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{jobs.length}</h3>
              <div className="text-muted small">Total Posted Jobs</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="stat-card">
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-record-circle-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{openJobsCount}</h3>
              <div className="text-muted small">Active Open Postings</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="stat-card">
            <div className="stat-icon bg-warning-subtle text-warning">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{applications.length}</h3>
              <div className="text-muted small">Total Applicants</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Jobs Table */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Posted Jobs</h5>
              <Link to="/recruiter/jobs" className="btn btn-sm btn-outline-custom">View All</Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading jobs..." />
            ) : jobs.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No jobs posted yet. <Link to="/recruiter/jobs/create">Post your first job</Link>!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Applicants</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <Link to={`/jobs/${job.id}`} className="fw-semibold text-dark text-decoration-none">
                            {job.title}
                          </Link>
                          <div className="small text-muted">{job.location}</div>
                        </td>
                        <td><StatusBadge type="jobType" value={job.jobType} /></td>
                        <td><span className="badge bg-light text-dark border">{job.applicantCount}</span></td>
                        <td><StatusBadge type="jobStatus" value={job.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Applicants</h5>
              <Link to="/recruiter/applications" className="btn btn-sm btn-outline-custom">Review All</Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading applicants..." />
            ) : applications.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No applications received yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Candidate</th>
                      <th>Applied Job</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="fw-semibold text-dark">{app.candidate?.fullName}</div>
                          <div className="small text-muted">{app.candidate?.email}</div>
                        </td>
                        <td className="small text-truncate" style={{ maxWidth: '140px' }}>
                          {app.job?.title}
                        </td>
                        <td><StatusBadge type="application" value={app.status} /></td>
                        <td className="text-end">
                          <Link to="/recruiter/applications" className="btn btn-sm btn-outline-primary">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
