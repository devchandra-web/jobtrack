import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getInitialFormState = () => ({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'CANDIDATE',
  companyName: '',
  companyWebsite: '',
  location: '',
});

const Register = () => {
  const [formData, setFormData] = useState(getInitialFormState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(getInitialFormState());
    setError('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setFormData(getInitialFormState());
    setError('');
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.role === 'RECRUITER' && !formData.companyName) {
      setError('Company name is required for recruiter registration.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        location: formData.location,
      });

      if (res.success) {
        navigate('/login', { state: { registered: true } });
      }
    } catch (err) {
      console.error('Registration error', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-3">
                <i className="bi bi-person-plus-fill fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Create Your Account</h3>
              <p className="text-muted small">Join JobTrack as a Candidate or Recruiter</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} onReset={handleReset} noValidate autoComplete="off">
              {/* Role Selection Tabs */}
              <div className="mb-4">
                <label className="form-label fw-medium text-dark d-block">I am registering as a:</label>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="role"
                    id="roleCandidate"
                    value="CANDIDATE"
                    checked={formData.role === 'CANDIDATE'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-primary py-2.5 fw-semibold" htmlFor="roleCandidate">
                    <i className="bi bi-person me-2"></i> Job Candidate
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="role"
                    id="roleRecruiter"
                    value="RECRUITER"
                    checked={formData.role === 'RECRUITER'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-primary py-2.5 fw-semibold" htmlFor="roleRecruiter">
                    <i className="bi bi-building me-2"></i> Employer / Recruiter
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-medium text-dark">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control form-control-custom"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onInput={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium text-dark">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control form-control-custom"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onInput={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              {/* Conditional Recruiter Fields */}
              {formData.role === 'RECRUITER' && (
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <h6 className="fw-bold text-dark mb-3">Company Profile Details</h6>
                  <div className="mb-3">
                    <label htmlFor="companyName" className="form-label small fw-medium text-dark">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      className="form-control form-control-custom"
                      placeholder="e.g. Acme Tech Solutions"
                      value={formData.companyName}
                      onChange={handleChange}
                      onInput={handleChange}
                      autoComplete="organization"
                      required={formData.role === 'RECRUITER'}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="companyWebsite" className="form-label small fw-medium text-dark">Company Website (Optional)</label>
                    <input
                      type="url"
                      id="companyWebsite"
                      name="companyWebsite"
                      className="form-control form-control-custom"
                      placeholder="https://example.com"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      onInput={handleChange}
                      autoComplete="url"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="form-label small fw-medium text-dark">Headquarters / Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="form-control form-control-custom"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={handleChange}
                      onInput={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label fw-medium text-dark">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control form-control-custom"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onInput={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label fw-medium text-dark">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control form-control-custom"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onInput={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary-custom flex-grow-1 py-2.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-secondary py-2.5 px-4 d-inline-flex align-items-center justify-content-center gap-1"
                  disabled={isSubmitting}
                  title="Reset form fields"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                  <span>Reset</span>
                </button>
              </div>
            </form>

            <div className="text-center mt-3 pt-3 border-top">
              <p className="text-muted small mb-0">
                Already have an account?{' '}
                <Link to="/login" className="fw-bold text-primary text-decoration-none">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
