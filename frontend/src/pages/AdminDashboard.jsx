import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await userService.getAdminDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container py-5"><LoadingSpinner text="Fetching admin system metrics..." /></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-shield-lock-fill text-warning me-2"></i> Admin System Dashboard
          </h2>
          <p className="text-muted mb-0">Platform governance, user metrics, and application breakdown.</p>
        </div>
        <Link to="/admin/users" className="btn btn-primary-custom">
          <i className="bi bi-people-fill me-2"></i> Manage User Accounts
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{stats?.totalUsers || 0}</h3>
              <div className="text-muted small">Total System Users</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-info-subtle text-info">
              <i className="bi bi-person-workspace"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{stats?.totalCandidates || 0}</h3>
              <div className="text-muted small">Registered Candidates</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-purple-subtle text-purple">
              <i className="bi bi-building-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{stats?.totalRecruiters || 0}</h3>
              <div className="text-muted small">Recruiter Accounts</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{stats?.totalJobs || 0}</h3>
              <div className="text-muted small">Total Jobs Posted</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Application Status Breakdown */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Applications by Status</h5>
            <p className="text-muted small mb-4">Total Applications across platform: {stats?.totalApplications || 0}</p>

            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-primary"><i className="bi bi-file-earmark-text me-2"></i> APPLIED</span>
                <span className="badge bg-primary fs-6">{stats?.applicationsByStatus?.APPLIED || 0}</span>
              </div>
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-warning"><i className="bi bi-star me-2"></i> SHORTLISTED</span>
                <span className="badge bg-warning text-dark fs-6">{stats?.applicationsByStatus?.SHORTLISTED || 0}</span>
              </div>
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-purple"><i className="bi bi-calendar-event me-2"></i> INTERVIEW</span>
                <span className="badge bg-purple text-white fs-6">{stats?.applicationsByStatus?.INTERVIEW || 0}</span>
              </div>
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-success"><i className="bi bi-check-circle me-2"></i> SELECTED</span>
                <span className="badge bg-success fs-6">{stats?.applicationsByStatus?.SELECTED || 0}</span>
              </div>
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-danger"><i className="bi bi-x-circle me-2"></i> REJECTED</span>
                <span className="badge bg-danger fs-6">{stats?.applicationsByStatus?.REJECTED || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Administrative Controls</h5>
            <p className="text-muted small mb-4">Quick governance shortcuts and auditing tasks.</p>

            <div className="d-grid gap-3">
              <Link to="/admin/users" className="btn btn-outline-primary text-start p-3 rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold"><i className="bi bi-people me-2"></i> User Directory & Account Activation</div>
                  <div className="small text-muted">Activate or deactivate user access, filter by CANDIDATE or RECRUITER.</div>
                </div>
                <i className="bi bi-chevron-right"></i>
              </Link>

              <Link to="/jobs" className="btn btn-outline-success text-start p-3 rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold"><i className="bi bi-search me-2"></i> System Job Listings Oversight</div>
                  <div className="small text-muted">Browse, audit, or delete fraudulent job listings.</div>
                </div>
                <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
