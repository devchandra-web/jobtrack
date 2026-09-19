import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner text="Verifying authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0 rounded-4 max-w-md mx-auto">
          <i className="bi bi-shield-slash-fill text-danger fs-1 mb-3"></i>
          <h3 className="fw-bold">403 - Access Denied</h3>
          <p className="text-muted mb-4">
            You do not have permission to access this page. Required role: {allowedRoles.join(' or ')}.
          </p>
          <div>
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
