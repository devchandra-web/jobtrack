import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const RecruiterApplications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Status Modal state
  const [activeApp, setActiveApp] = useState(null);
  const [newStatus, setNewStatus] = useState('APPLIED');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Cover letter modal view
  const [viewCoverLetter, setViewCoverLetter] = useState(null);

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await jobService.getRecruiterJobs(0, 100);
        if (res.success && res.data) {
          setPostedJobs(res.data.content);
        }
      } catch (err) {
        console.error('Error fetching posted jobs', err);
      }
    };
    fetchRecruiterJobs();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        jobId: selectedJobId || undefined,
        status: selectedStatus || undefined,
      };
      const res = await applicationService.getRecruiterApplications(params);
      if (res.success && res.data) {
        setApplications(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching applicant list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, selectedJobId, selectedStatus]);

  const handleOpenStatusModal = (app) => {
    setActiveApp(app);
    setNewStatus(app.status);
    setNotes(app.notes || '');
    setUpdateError('');
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setUpdateError('');
    try {
      setUpdating(true);
      const res = await applicationService.updateApplicationStatus(activeApp.id, {
        status: newStatus,
        notes: notes,
      });

      if (res.success) {
        setActiveApp(null);
        fetchApplications();
      }
    } catch (err) {
      console.error('Status update failed', err);
      setUpdateError(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Applicant Management</h2>
        <p className="text-muted">Review candidate resumes, cover letters, and update hiring pipeline status.</p>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <label className="form-label small fw-semibold text-dark mb-1">Filter by Job Posting</label>
            <select
              className="form-select form-select-custom"
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Posted Jobs</option>
              {postedJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.companyName})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold text-dark mb-1">Filter by Application Status</label>
            <select
              className="form-select form-select-custom"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Statuses</option>
              <option value="APPLIED">APPLIED</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="SELECTED">SELECTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-outline-custom w-100"
              onClick={() => {
                setSelectedJobId('');
                setSelectedStatus('');
                setSearchParams({});
                setPage(0);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        {loading ? (
          <LoadingSpinner text="Fetching candidate applications..." />
        ) : applications.length === 0 ? (
          <EmptyState
            icon="bi-people text-muted"
            title="No Candidates Found"
            message="No applications have been submitted matching your selected job filters."
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Candidate Name</th>
                    <th>Job Title</th>
                    <th>Applied Date</th>
                    <th>Resume</th>
                    <th>Cover Letter</th>
                    <th>Pipeline Status</th>
                    <th className="text-end">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="fw-bold text-dark">{app.candidate?.fullName}</div>
                        <div className="small text-muted">{app.candidate?.email}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{app.job?.title}</div>
                        <div className="small text-muted">{app.job?.location}</div>
                      </td>
                      <td className="small text-muted">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td>
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-file-pdf me-1"></i> View Resume
                          </a>
                        ) : (
                          <span className="small text-muted">No URL</span>
                        )}
                      </td>
                      <td>
                        {app.coverLetter ? (
                          <button
                            className="btn btn-sm btn-light border"
                            onClick={() => setViewCoverLetter(app)}
                          >
                            <i className="bi bi-eye me-1"></i> Read Note
                          </button>
                        ) : (
                          <span className="small text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge type="application" value={app.status} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-primary-custom"
                          onClick={() => handleOpenStatusModal(app)}
                        >
                          Change Status
                        </button>
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

      {/* Status Change Modal */}
      {activeApp && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Update Hiring Status</h5>
                <button type="button" className="btn-close" onClick={() => setActiveApp(null)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="fw-bold">{activeApp.candidate?.fullName}</div>
                  <div className="small text-muted">Role: {activeApp.job?.title}</div>
                </div>

                {updateError && <div className="alert alert-danger mb-3">{updateError}</div>}

                <form onSubmit={handleStatusUpdateSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Application Status *</label>
                    <select
                      className="form-select form-select-custom"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      required
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="SELECTED">SELECTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium text-dark">Recruiter Notes (Optional)</label>
                    <textarea
                      className="form-control form-control-custom"
                      rows="3"
                      placeholder="e.g. Scheduled technical interview for Tuesday 10 AM..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => setActiveApp(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary-custom" disabled={updating}>
                      {updating ? 'Saving...' : 'Update Status'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Cover Letter Modal */}
      {viewCoverLetter && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Cover Letter</h5>
                <button type="button" className="btn-close" onClick={() => setViewCoverLetter(null)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="fw-bold mb-1">{viewCoverLetter.candidate?.fullName}</div>
                <div className="small text-muted mb-3">Applied for {viewCoverLetter.job?.title}</div>
                <div className="p-3 bg-light rounded-3 text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {viewCoverLetter.coverLetter}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-secondary" onClick={() => setViewCoverLetter(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
