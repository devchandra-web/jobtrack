import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-logo" to="/">
          <i className="bi bi-briefcase-fill text-primary"></i>
          <span>Job<span className="text-primary">Track</span></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${isActive('/') ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link nav-link-custom ${isActive('/jobs') ? 'active' : ''}`} to="/jobs">
                Browse Jobs
              </Link>
            </li>

            {isAuthenticated && isCandidate && (
              <li className="nav-item">
                <Link
                  className={`nav-link nav-link-custom ${isActive('/candidate/dashboard') ? 'active' : ''}`}
                  to="/candidate/dashboard"
                >
                  <i className="bi bi-speedometer2 me-1"></i> My Applications
                </Link>
              </li>
            )}

            {isAuthenticated && (isRecruiter || isAdmin) && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-custom ${isActive('/recruiter/dashboard') ? 'active' : ''}`}
                    to="/recruiter/dashboard"
                  >
                    Recruiter Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-custom ${isActive('/recruiter/jobs') ? 'active' : ''}`}
                    to="/recruiter/jobs"
                  >
                    Posted Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-custom ${isActive('/recruiter/applications') ? 'active' : ''}`}
                    to="/recruiter/applications"
                  >
                    Applicants
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className={`nav-link nav-link-custom dropdown-toggle ${isActive('/admin/dashboard') || isActive('/admin/users') ? 'active' : ''}`}
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-shield-lock-fill me-1 text-warning"></i> Admin Panel
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <Link className="dropdown-item" to="/admin/dashboard">
                      <i className="bi bi-pie-chart-fill me-2"></i> Dashboard Overview
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/users">
                      <i className="bi bi-people-fill me-2"></i> Manage Users
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.fullName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li className="dropdown-header">
                    <strong>{user?.email}</strong>
                    <div className="text-muted small">Role: {user?.role}</div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-fill me-2"></i> Edit Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary-custom">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
