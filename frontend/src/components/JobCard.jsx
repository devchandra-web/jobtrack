import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const JobCard = ({ job }) => {
  return (
    <div className="card job-card h-100 p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge bg-light text-primary border mb-2 fw-semibold">
            {job.companyName}
          </span>
          <h5 className="card-title fw-bold text-dark mb-1">
            <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark hover-primary">
              {job.title}
            </Link>
          </h5>
        </div>
        <StatusBadge type="jobType" value={job.jobType} />
      </div>

      <p className="card-text text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <div className="d-flex flex-wrap gap-3 text-muted small mb-3 border-top pt-3">
        <div>
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          {job.location}
        </div>
        {job.experienceLevel && (
          <div>
            <i className="bi bi-briefcase-fill text-warning me-1"></i>
            {job.experienceLevel}
          </div>
        )}
        {job.salaryRange && (
          <div>
            <i className="bi bi-cash-stack text-success me-1"></i>
            {job.salaryRange}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center border-top pt-3">
        <span className="text-muted small">
          <i className="bi bi-clock me-1"></i>
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-custom">
          View Details <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
