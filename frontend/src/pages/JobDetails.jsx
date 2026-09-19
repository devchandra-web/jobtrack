import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const { isAuthenticated, isCandidate, isRecruiter, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(id);
        if (res.success && res.data) {
          setJob(res.data);
        }
      } catch (err) {
        console.error('Job fetch error', err);
        setError('Job posting not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyError('');

    try {
      setSubmitting(true);
      const res = await applicationService.applyForJob({
        jobId: Number(id),
        resumeUrl,
        coverLetter,
      });

      if (res.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setShowApplyModal(false);
          setApplySuccess(false);
          navigate('/candidate/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Application submit error', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit application.';
      setApplyError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container py-5"><LoadingSpinner text="Loading job details..." /></div>;

  if (error || !job) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning py-4 rounded-4 shadow-sm max-w-md mx-auto">
          <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
          <h5>Job Not Found</h5>
          <p className="mb-3">{error || 'The requested job could not be retrieved.'}</p>
          <Link to="/jobs" className="btn btn-primary-custom">Browse All Jobs</Link>
        </div>
      </div>
    );
  }

  const isJobOwner = user && (job.recruiter?.id === user.id || isAdmin);

  return (
    <div className="container py-5">
      <Link to="/jobs" className="text-decoration-none text-muted small d-inline-flex align-items-center mb-4">
        <i className="bi bi-arrow-left me-1"></i> Back to All Jobs
      </Link>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Main Job Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <span className="badge bg-light text-primary border mb-2 fw-semibold fs-6">
                  {job.companyName}
                </span>
                <h2 className="fw-bold text-dark mb-2">{job.title}</h2>
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                  <span><i className="bi bi-geo-alt-fill text-danger me-1"></i>{job.location}</span>
                  <span><i className="bi bi-clock me-1"></i>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  <span><i className="bi bi-people me-1 text-info"></i>{job.applicantCount} Applicant{job.applicantCount === 1 ? '' : 's'}</span>
                </div>
              </div>

              <div className="d-flex flex-column align-items-end gap-2">
                <StatusBadge type="jobType" value={job.jobType} />
                <StatusBadge type="jobStatus" value={job.status} />
              </div>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h5 className="fw-bold text-dark mb-3">Job Description</h5>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-3">Requirements & Key Skills</h5>
                <div className="bg-light p-4 rounded-3 text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                  {job.requirements}
                </div>
              </div>
            )}

            <div className="row g-3 bg-light p-3 rounded-3 mt-2">
              <div className="col-md-6">
                <div className="small text-muted">Experience Level</div>
                <div className="fw-bold text-dark">{job.experienceLevel || 'Not specified'}</div>
              </div>
              <div className="col-md-6">
                <div className="small text-muted">Offered Compensation</div>
                <div className="fw-bold text-success">{job.salaryRange || 'Competitive Salary'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Action Box */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-dark mb-3">Application Status</h5>

            {job.status === 'CLOSED' ? (
              <div className="alert alert-secondary mb-0 text-center">
                <i className="bi bi-lock-fill d-block fs-3 mb-2"></i>
                This job posting is closed and no longer accepting applications.
              </div>
            ) : isAuthenticated && isCandidate ? (
              <div>
                <p className="text-muted small mb-4">
                  Ready to take the next step in your career? Submit your application directly to the recruiter.
                </p>
                <button
                  className="btn btn-primary-custom w-100 py-2.5 mb-2"
                  onClick={() => setShowApplyModal(true)}
                >
                  <i className="bi bi-send-fill me-2"></i> Apply For Position
                </button>
              </div>
            ) : isAuthenticated && (isRecruiter || isAdmin) ? (
              <div>
                <p className="text-muted small mb-3">
                  {isJobOwner ? 'You are managing this job posting.' : 'Logged in as Recruiter/Admin.'}
                </p>
                {isJobOwner && (
                  <div className="d-grid gap-2">
                    <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn btn-outline-primary">
                      <i className="bi bi-pencil-square me-2"></i> Edit Job Listing
                    </Link>
                    <Link to={`/recruiter/applications?jobId=${job.id}`} className="btn btn-primary-custom">
                      <i className="bi bi-people-fill me-2"></i> View Candidates ({job.applicantCount})
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-muted small mb-3">
                  You must be signed in as a candidate to apply for this job.
                </p>
                <Link to="/login" className="btn btn-primary-custom w-100 mb-2">
                  Sign In to Apply
                </Link>
                <Link to="/register" className="btn btn-outline-custom w-100">
                  Register Candidate Account
                </Link>
              </div>
            )}

            <hr className="my-4" />

            <div className="small text-muted">
              <h6 className="fw-bold text-dark mb-2">About Recruiter</h6>
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-person-circle fs-4 text-primary"></i>
                <div>
                  <div className="fw-semibold text-dark">{job.recruiter?.fullName}</div>
                  <div className="small">{job.recruiter?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Apply for {job.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
              </div>

              <div className="modal-body py-4">
                {applySuccess ? (
                  <div className="alert alert-success text-center py-4 mb-0 rounded-3">
                    <i className="bi bi-check-circle-fill fs-1 d-block mb-2"></i>
                    <h5 className="fw-bold">Application Submitted!</h5>
                    <p className="mb-0 small">Redirecting to candidate application dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit}>
                    {applyError && (
                      <div className="alert alert-danger rounded-3 mb-3">{applyError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark">Resume URL (PDF / Cloud Link)</label>
                      <input
                        type="url"
                        className="form-control form-control-custom"
                        placeholder="https://example.com/my-resume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        required
                      />
                      <small className="text-muted">Provide a direct link to your Google Drive, Dropbox, or LinkedIn PDF resume.</small>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium text-dark">Cover Letter / Note to Hiring Manager</label>
                      <textarea
                        className="form-control form-control-custom"
                        rows="5"
                        placeholder="Highlight your relevant experience, technical skills, and why you are excited about this position..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowApplyModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary-custom"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
