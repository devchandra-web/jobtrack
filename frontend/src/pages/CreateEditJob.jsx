import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateEditJob = () => {
  const { id } = useParams(); // If present, edit mode; else create mode
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: 'FULL_TIME',
    experienceLevel: '',
    salaryRange: '',
    description: '',
    requirements: '',
    status: 'OPEN',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const res = await jobService.getJobById(id);
          if (res.success && res.data) {
            const j = res.data;
            setFormData({
              title: j.title || '',
              companyName: j.companyName || '',
              location: j.location || '',
              jobType: j.jobType || 'FULL_TIME',
              experienceLevel: j.experienceLevel || '',
              salaryRange: j.salaryRange || '',
              description: j.description || '',
              requirements: j.requirements || '',
              status: j.status || 'OPEN',
            });
          }
        } catch (err) {
          console.error('Job fetch error', err);
          setError('Could not load job for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        const res = await jobService.updateJob(id, formData);
        if (res.success) {
          navigate('/recruiter/jobs');
        }
      } else {
        const res = await jobService.createJob(formData);
        if (res.success) {
          navigate('/recruiter/jobs');
        }
      }
    } catch (err) {
      console.error('Save job error', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to save job posting.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="container py-5"><LoadingSpinner text="Loading job form..." /></div>;

  return (
    <div className="container py-5">
      <Link to="/recruiter/jobs" className="text-decoration-none text-muted small d-inline-flex align-items-center mb-4">
        <i className="bi bi-arrow-left me-1"></i> Back to Posted Jobs
      </Link>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <h3 className="fw-bold text-dark mb-1">
              {isEditMode ? 'Edit Job Posting' : 'Create New Job Requisition'}
            </h3>
            <p className="text-muted mb-4">
              Fill out the details below to publish your position to job seekers.
            </p>

            {error && (
              <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control form-control-custom"
                    placeholder="e.g. Senior Full Stack Java Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-control form-control-custom"
                    placeholder="e.g. TechCorp Solutions"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control form-control-custom"
                    placeholder="e.g. San Francisco, CA / Remote"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Job Type *</label>
                  <select
                    name="jobType"
                    className="form-select form-select-custom"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Experience Level</label>
                  <input
                    type="text"
                    name="experienceLevel"
                    className="form-control form-control-custom"
                    placeholder="e.g. Mid-Senior Level (3-5 yrs)"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-dark">Salary Range / Compensation</label>
                  <input
                    type="text"
                    name="salaryRange"
                    className="form-control form-control-custom"
                    placeholder="e.g. $110,000 - $135,000 / yr"
                    value={formData.salaryRange}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {isEditMode && (
                <div className="mb-3">
                  <label className="form-label fw-medium text-dark">Posting Status</label>
                  <select
                    name="status"
                    className="form-select form-select-custom"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="OPEN">OPEN (Accepting Applications)</option>
                    <option value="CLOSED">CLOSED (Archived)</option>
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Job Description *</label>
                <textarea
                  name="description"
                  className="form-control form-control-custom"
                  rows="6"
                  placeholder="Describe role responsibilities, team culture, key objectives..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-dark">Requirements & Key Qualifications</label>
                <textarea
                  name="requirements"
                  className="form-control form-control-custom"
                  rows="4"
                  placeholder="List bullet points of required skills, tech stack, education..."
                  value={formData.requirements}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 border-top pt-4">
                <Link to="/recruiter/jobs" className="btn btn-light px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : isEditMode ? (
                    'Update Job Listing'
                  ) : (
                    'Publish Job Posting'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditJob;
