import React from 'react';

const StatusBadge = ({ type, value }) => {
  if (!value) return null;

  if (type === 'application') {
    const config = {
      APPLIED: { bg: 'bg-primary-subtle text-primary border-primary', icon: 'bi-file-earmark-text' },
      SHORTLISTED: { bg: 'bg-warning-subtle text-warning border-warning', icon: 'bi-star-fill' },
      INTERVIEW: { bg: 'bg-purple-subtle text-purple border-purple', icon: 'bi-calendar-event' },
      SELECTED: { bg: 'bg-success-subtle text-success border-success', icon: 'bi-check-circle-fill' },
      REJECTED: { bg: 'bg-danger-subtle text-danger border-danger', icon: 'bi-x-circle-fill' },
    };
    const style = config[value] || { bg: 'bg-secondary-subtle text-secondary', icon: 'bi-info-circle' };
    return (
      <span className={`badge border px-3 py-2 rounded-pill font-monospace small ${style.bg}`}>
        <i className={`bi ${style.icon} me-1`}></i>
        {value}
      </span>
    );
  }

  if (type === 'jobType') {
    const config = {
      FULL_TIME: { bg: 'bg-primary text-white', label: 'Full Time' },
      PART_TIME: { bg: 'bg-info text-dark', label: 'Part Time' },
      CONTRACT: { bg: 'bg-warning text-dark', label: 'Contract' },
      REMOTE: { bg: 'bg-success text-white', label: 'Remote' },
    };
    const style = config[value] || { bg: 'bg-secondary text-white', label: value };
    return <span className={`badge ${style.bg} px-2.5 py-1.5 rounded-pill font-semibold`}>{style.label}</span>;
  }

  if (type === 'jobStatus') {
    return value === 'OPEN' ? (
      <span className="badge bg-success-subtle text-success border border-success px-2.5 py-1.5 rounded-pill">
        <i className="bi bi-record-fill me-1"></i> OPEN
      </span>
    ) : (
      <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2.5 py-1.5 rounded-pill">
        <i className="bi bi-x-circle me-1"></i> CLOSED
      </span>
    );
  }

  if (type === 'userStatus') {
    return value === 'ACTIVE' ? (
      <span className="badge bg-success text-white px-2.5 py-1.5 rounded-pill">Active</span>
    ) : (
      <span className="badge bg-danger text-white px-2.5 py-1.5 rounded-pill">Inactive</span>
    );
  }

  return <span className="badge bg-secondary px-2 py-1">{value}</span>;
};

export default StatusBadge;
