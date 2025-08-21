import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LoanDetailsModal({
  show,
  onClose,
  loan,
  statusOverride = null,
}) {
  if (!show || !loan) return null;

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const status =
    (statusOverride || loan.status || "pending")
      .toLowerCase();

  const statusMap = {
    approved: { label: "Approved", className: "modal-detail-value-approved" },
    rejected: { label: "Denied", className: "modal-detail-value-denied" },
    denied: { label: "Denied", className: "modal-detail-value-denied" },
    pending: { label: "Pending", className: "status-pending" },
    pending_approval: { label: "Pending", className: "status-pending" },
  };

  const { label: statusLabel, className: statusClass } =
    statusMap[status] || {
      label: formatKey(status),
      className: "modal-detail-value",
    };

  const dateKeys = [
    "application_date",
    "created_at",
    "date_applied",
    "updated_at",
    "approved_at",
    "approval_date",
    "denied_at",
    "rejected_at",
    "payment_deadline"
  ];

  const elements = [];
  for (const [key, value] of Object.entries(loan)) {
    if (value == null || value === "") continue;

    if (key.toLowerCase() === "status") {
      elements.push(
        <div key={key} className="modal-detail-item">
          <span className="modal-detail-label">{formatKey(key)}:</span>{" "}
          <span className={statusClass}>{statusLabel}</span>
        </div>
      );
    } else if (dateKeys.includes(key)) {
      elements.push(
        <div key={key} className="modal-detail-item">
          <span className="modal-detail-label">{formatKey(key)}:</span>{" "}
          <span className="modal-detail-value">{formatDate(value)}</span>
        </div>
      );
    } else if (key === "user" && typeof value === "object") {
      for (const [ukey, uval] of Object.entries(value)) {
        if (uval == null || uval === "") continue;
        elements.push(
          <div key={`user-${ukey}`} className="modal-detail-item user-detail">
            <span className="modal-detail-label">User {formatKey(ukey)}:</span>{" "}
            <span className="modal-detail-value">{String(uval)}</span>
          </div>
        );
      }
    } else if (typeof value !== "object") {
      elements.push(
        <div key={key} className="modal-detail-item">
          <span className="modal-detail-label">{formatKey(key)}:</span>{" "}
          <span className="modal-detail-value">{String(value)}</span>
        </div>
      );
    }
  }

  const modalContent = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Loan Details</h3>
        {elements.length > 0 ? (
          <div className="modal-details-container">{elements}</div>
        ) : (
          <p className="no-details">No details available.</p>
        )}
        <div className="modal-actions modal-actions-right">
          <button onClick={onClose} className="cancel-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default LoanDetailsModal;