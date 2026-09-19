import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 my-auto text-center">
      <div className="card border-0 shadow-lg p-5 max-w-md mx-auto rounded-4">
        <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
        <h4 className="fw-bold text-dark mt-2 mb-3">Page Not Found</h4>
        <p className="text-muted mb-4">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <div>
          <Link to="/" className="btn btn-primary-custom">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
