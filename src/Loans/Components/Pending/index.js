import React, { useState, useEffect } from "react";
import useFetchLoanApplications from "../Hooks/useFetchLoanApplications";
import useUpdateLoanStatus from "../Hooks/useUpdateLoanStatus";
import LoanDetailsModal from "../../../shared-components/Loan-Details-Modal";
import "./style.css";

const ITEMS_PER_PAGE = 8;

function ConfirmActionModal({ show, onClose, onConfirm, action, loan, loading }) {
  if (!show || !loan) return null;
  return (
    <div className="modal-backdrop-pending" onClick={onClose} style={{ cursor: "pointer" }}>
      <div className="modal-content-pending"  onClick={e => e.stopPropagation()}>
        <h3>{action === "approve" ? "Approve Loan" : "Deny Loan"}</h3>
        <p>
          Are you sure you want to {action} the loan for{" "}
          <strong>{loan.user_fullname || "N/A"}</strong> of amount{" "}
          <strong>{loan.amount_requested}</strong>?
        </p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn" disabled={loading}>
            Yes, {action}
          </button>
          <button onClick={onClose} className="cancel-btn" id="close" disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_TABS = [
  { key: "pending_approval", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Denied" },
];

function Pending() {
  const { loading, error, loanApplications, fetchLoanApplications } = useFetchLoanApplications();
  const { updateLoanStatus, loading: updating } = useUpdateLoanStatus();

  const [activeTab, setActiveTab] = useState("pending_approval");
  const [page, setPage] = useState(1);

  const [detailModalLoan, setDetailModalLoan] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState({
    show: false,
    action: null,
    loan: null,
  });

 

  useEffect(() => {
    fetchLoanApplications();
  }, [fetchLoanApplications]);
  const loansByStatus = React.useMemo(() => {
    const grouped = {
      pending_approval: [],
      approved: [],
      rejected: [],
    };
    if (Array.isArray(loanApplications)) {
      loanApplications.forEach((loan) => {
        if (grouped[loan.status]) {
          grouped[loan.status].push(loan);
        }
      });
    }
    return grouped;
  }, [loanApplications]);

  const tabLoans = loansByStatus[activeTab] || [];

  const totalPages = Math.max(1, Math.ceil(tabLoans.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentLoans = tabLoans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  function openDetailModal(loan) {
    setDetailModalLoan(loan);
  }

  function closeDetailModal() {
    setDetailModalLoan(null);
  }

  function openConfirmModal(loanId, action) {
    const loan = tabLoans.find((l) => l.loan_id === loanId);
    if (loan) {
      setConfirmModalData({ show: true, action, loan });
    }
  }

  function closeConfirmModal() {
    setConfirmModalData({ show: false, action: null, loan: null });
  }

  async function confirmAction() {
    const { action, loan } = confirmModalData;
    if (!loan) {
      closeConfirmModal();
      return;
    }
    try {
      await updateLoanStatus(loan.loan_id, action);
      await fetchLoanApplications();
      closeConfirmModal();
    } catch (err) {
      alert("Failed to update loan status: " + err.message);
      closeConfirmModal();
    }
  }

  if (loading) return <h1>Loading ....</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div className="loan-applications-container-pending">
      <LoanDetailsModal show={!!detailModalLoan} onClose={closeDetailModal} loan={detailModalLoan}/>

      <ConfirmActionModal
        show={confirmModalData.show}
        action={confirmModalData.action}
        loan={confirmModalData.loan}
        onClose={closeConfirmModal}
        onConfirm={confirmAction}
        loading={updating}
      />

   
      <div className="header-row">
        <h2>Loan Applications</h2>
        <div className="tabs">
          {STATUS_TABS.map(tab => (
            <div
              key={tab.key}
              className={`tab${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}{" "}
              <span className="count-indicator">(
                {loansByStatus[tab.key]?.length || 0})
              </span>
            </div>
          ))}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th id="header-start">No.</th>
            <th>Name</th>
            <th>National ID</th>
            <th>Loan Amount</th>
            <th>Credit Score</th>
            <th>Details</th>
            <th id="header">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentLoans.length > 0 ? (
            currentLoans.map((loan, idx) => (
              <tr key={loan.loan_id}>
                <td>{startIndex + idx + 1}</td>
                <td>{loan.user_fullname || "N/A"}</td>
                <td>{loan.national_id || loan.cooperative_id || "N/A"}</td>
                <td>{loan.amount_requested}</td>
                <td>{loan.credit_score_at_application || "-"}</td>
                <td>
                  <span
                    className="details-link"
                    onClick={() => openDetailModal(loan)}
                    style={{ cursor: "pointer", color: "green" }}
                  >
                    View
                  </span>
                </td>
                <td id="buttons-pending">
                  {activeTab === "pending_approval" ? (
                    <>
                      <button
                        className="approve-btn" id="approve-button"
                        onClick={() => openConfirmModal(loan.loan_id, "approve")}
                        disabled={updating}
                      >
                        Approve
                      </button>
                      <button
                        className="deny-btn" id="next-button"
                        onClick={() => openConfirmModal(loan.loan_id, "deny")}
                        disabled={updating}
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <span style={{ color: activeTab === "approved" ? "#2e7d32" : "#c62828", fontWeight: 600 }}>
                      {activeTab === "approved" ? "Approved" : "Denied"}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ color: "#888" }}>
                No {STATUS_TABS.find(t => t.key === activeTab).label.toLowerCase()} loans.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-button" 
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="pagination-button" 
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pending;