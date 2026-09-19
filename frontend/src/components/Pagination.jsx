import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination pagination-md shadow-sm rounded-3">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            className="page-item page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <i className="bi bi-chevron-left me-1"></i> Previous
          </button>
        </li>

        {pages.map((p) => (
          <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>
              {p + 1}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
