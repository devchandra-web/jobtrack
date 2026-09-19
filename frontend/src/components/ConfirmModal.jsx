import React from 'react';

const ConfirmModal = ({ show, title, message, confirmText = 'Confirm', confirmVariant = 'danger', onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block tab-index='-1'" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-3">
            <p className="text-muted mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={`btn btn-${confirmVariant}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
