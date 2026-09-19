import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No items found',
  message = 'There are no records to display at this moment.',
  actionLink,
  actionText,
}) => {
  return (
    <div className="card border-0 shadow-sm p-5 text-center my-4 rounded-4">
      <div className="mb-3">
        <i className={`bi ${icon} text-muted`} style={{ fontSize: '3.5rem', opacity: 0.6 }}></i>
      </div>
      <h4 className="fw-bold text-dark">{title}</h4>
      <p className="text-muted max-w-md mx-auto mb-4">{message}</p>
      {actionLink && actionText && (
        <div>
          <Link to={actionLink} className="btn btn-primary-custom">
            {actionText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
