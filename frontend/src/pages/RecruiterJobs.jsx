import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal delete state
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getRecruiterJobs(page, 10);
      if (res.success && res.data) {
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleDeleteConfirm = async () => {
    if (!deleteJobId) return;
    try {
      setDeleting(true);
      await jobService.deleteJob(deleteJobId);
      setDeleteJobId(null);
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job', err);
      alert('Failed to delete job posting.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Posted Job Requisitions</h2>
          <p className="text-muted mb-0">Manage your active job postings and review applicant counts.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn btn-primary-custom">
          <i className="bi bi-plus-lg me-1"></i> Create Job Posting
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        {loading ? (
          <LoadingSpinner text="Fetching your posted jobs..." />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="bi-briefcase text-primary"
            title="No Jobs Posted Yet"
            message="Start attracting top candidates by posting your first job requirement."
            actionLink="/recruiter/jobs/create"
            actionText="Post New Job"
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Job Title & Location</th>
                    <th>Company</th>
                    <th>Job Type</th>
                    <th>Salary Range</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link to={`/jobs/${job.id}`} className="fw-bold text-dark text-decoration-none">
                          {job.title}
                        </Link>
                        <div className="small text-muted">{job.location}</div>
                      </td>
                      <td><span className="small text-secondary">{job.companyName}</span></td>
                      <td><StatusBadge type="jobType" value={job.jobType} /></td>
                      <td><span className="small text-success fw-medium">{job.salaryRange || 'N/A'}</span></td>
                      <td><StatusBadge type="jobStatus" value={job.status} /></td>
                      <td>
                        <Link to={`/recruiter/applications?jobId=${job.id}`} className="badge bg-primary-subtle text-primary border border-primary px-3 py-1.5 rounded-pill text-decoration-none">
                          <i className="bi bi-people-fill me-1"></i> {job.applicantCount} Candidates
                        </Link>
                      </td>
                      <td className="text-end">
                        <div className="btn-group">
                          <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil"></i> Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeleteJobId(job.id)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
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

      <ConfirmModal
        show={!!deleteJobId}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? All candidate applications associated with this job will also be removed."
        confirmText={deleting ? 'Deleting...' : 'Delete Job'}
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteJobId(null)}
      />
    </div>
  );
};

export default RecruiterJobs;
