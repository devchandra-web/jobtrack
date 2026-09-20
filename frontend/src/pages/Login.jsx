import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login({ email, password });
      if (res.success && res.data) {
        const userRole = res.data.user.role;
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userRole === 'RECRUITER') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error', err);
      let msg = 'Invalid credentials or connection error.';
      if (err.response?.data) {
        if (err.response.data.errors && typeof err.response.data.errors === 'object') {
          msg = Object.values(err.response.data.errors).join('. ');
        } else if (err.response.data.message) {
          msg = err.response.data.message;
        } else if (err.response.data.error) {
          msg = err.response.data.error;
        }
      } else if (err.message && (err.message.includes('Network Error') || err.message.includes('timeout'))) {
        msg = 'Unable to connect to the backend API server. Please check your backend deployment status.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-3">
                <i className="bi bi-person-lock fs-2"></i>
              </div>
              <h3 className="fw-bold text-dark">Welcome Back</h3>
              <p className="text-muted small">Sign in to your JobTrack account</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium text-dark">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="off"
                    className="form-control form-control-custom border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onInput={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="password" className="form-label fw-medium text-dark">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    className="form-control form-control-custom border-start-0"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2.5 mb-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="border-top pt-3 mt-2">
              <label className="form-label small text-muted text-uppercase fw-bold mb-2">
                Quick Demo Login (1-Click Fill)
              </label>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary text-start d-flex justify-content-between align-items-center"
                  onClick={() => fillDemoAccount('alex@candidate.com', 'candidate123')}
                >
                  <span><i className="bi bi-person me-2"></i> Candidate Demo (alex@candidate.com)</span>
                  <span className="badge bg-primary">Candidate</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success text-start d-flex justify-content-between align-items-center"
                  onClick={() => fillDemoAccount('sarah@techcorp.com', 'recruiter123')}
                >
                  <span><i className="bi bi-building me-2"></i> Recruiter Demo (sarah@techcorp.com)</span>
                  <span className="badge bg-success">Recruiter</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning text-dark text-start d-flex justify-content-between align-items-center"
                  onClick={() => fillDemoAccount('admin@jobtrack.com', 'admin123')}
                >
                  <span><i className="bi bi-shield-lock me-2"></i> Admin Demo (admin@jobtrack.com)</span>
                  <span className="badge bg-warning text-dark">Admin</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4 pt-2 border-top">
              <p className="text-muted small mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="fw-bold text-primary text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
