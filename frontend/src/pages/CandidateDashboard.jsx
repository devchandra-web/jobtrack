import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await applicationService.getCandidateApplications(page, 10);
        if (res.success && res.data) {
          setApplications(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to load candidate applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [page]);

  // Status Metrics Breakdown
  const totalApplied = applications.length;
  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED').length;
  const interviewing = applications.filter(a => a.status === 'INTERVIEW').length;
  const selected = applications.filter(a => a.status === 'SELECTED').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Candidate Dashboard</h2>
        <p className="text-muted">Track the status of your submitted job applications.</p>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-file-earmark-text-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{totalApplied}</h3>
              <div className="text-muted small">Total Applications</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-warning-subtle text-warning">
              <i className="bi bi-star-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{shortlisted}</h3>
              <div className="text-muted small">Shortlisted</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-purple-subtle text-purple">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{interviewing}</h3>
              <div className="text-muted small">Interviews Scheduled</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{selected}</h3>
              <div className="text-muted small">Selected / Offers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold text-dark mb-4">My Submitted Applications</h5>

        {loading ? (
          <LoadingSpinner text="Fetching your application history..." />
        ) : applications.length === 0 ? (
          <EmptyState
            icon="bi-briefcase"
            title="You haven't applied to any jobs yet"
            message="Browse available job listings and start submitting applications!"
            actionLink="/jobs"
            actionText="Browse Jobs"
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Job Title & Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Recruiter Notes</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="fw-bold text-dark">{app.job?.title}</div>
                        <div className="small text-muted">{app.job?.companyName}</div>
                      </td>
                      <td>
                        <span className="small text-muted">{app.job?.location}</span>
                      </td>
                      <td>
                        <StatusBadge type="application" value={app.status} />
                      </td>
                      <td className="small text-muted">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td>
                        {app.notes ? (
                          <span className="small text-secondary fst-italic">{app.notes}</span>
                        ) : (
                          <span className="small text-muted">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        <Link to={`/jobs/${app.job?.id}`} className="btn btn-sm btn-outline-custom">
                          View Job
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
