import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetchLoanApplications from "../Hooks/useFetchLoanApplications";
import LoanDetailsModal from "../../../shared-components/Loan-Details-Modal";
import LoanApplicationsHeader from "../../../shared-components/LoanApplicationsHeader";
import "./style.css";

const ITEMS_PER_PAGE = 8;
const LOCAL_STORAGE_KEY_DENIED = "deniedLoans";
const LOCAL_STORAGE_KEY_APPROVED = "approvedLoans";

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : [];
    const uniqueMap = new Map();
    parsed.forEach((loan) => {
      if (loan && loan.loan_id != null) uniqueMap.set(loan.loan_id, loan);
    });
    return Array.from(uniqueMap.values());
  } catch {
    return [];
  }
}

function Denied() {
  const navigate = useNavigate();
  const location = useLocation();

  const { loanApplications, loading, error } = useFetchLoanApplications();

  const [approvedLoans, setApprovedLoans] = useState([]);
  const [deniedLoans, setDeniedLoans] = useState([]);
  const [page, setPage] = useState(1);
  const [detailModalLoan, setDetailModalLoan] = useState(null);
  const [detailModalStatus, setDetailModalStatus] = useState(null);

  useEffect(() => {
    setApprovedLoans(loadFromStorage(LOCAL_STORAGE_KEY_APPROVED));
    setDeniedLoans(loadFromStorage(LOCAL_STORAGE_KEY_DENIED));
  }, [location.key]);

  const approvedSet = new Set(approvedLoans.map((l) => l.loan_id));
  const deniedSet = new Set(deniedLoans.map((l) => l.loan_id));

  const filteredDeniedLoans = loanApplications.filter((loan) =>
    deniedSet.has(loan.loan_id)
  );

  const filteredPendingLoans = loanApplications.filter(
    (loan) => !approvedSet.has(loan.loan_id) && !deniedSet.has(loan.loan_id)
  );

  const pendingCount = filteredPendingLoans.length;
  const approvedCount = approvedLoans.length;
  const deniedCount = filteredDeniedLoans.length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDeniedLoans.length / ITEMS_PER_PAGE)
  );
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentLoans = filteredDeniedLoans.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const openDetailModal = (loan) => {
    setDetailModalLoan(loan);
    setDetailModalStatus("denied");
  };
  const closeDetailModal = () => {
    setDetailModalLoan(null);
    setDetailModalStatus(null);
  };

  if (loading) return <h1>Loading ...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div className="loan-applications-container">
      <LoanDetailsModal show={!!detailModalLoan} onClose={closeDetailModal} loan={detailModalLoan} statusOverride={detailModalStatus}/>

      <LoanApplicationsHeader navigate={navigate} activeTab="denied"
        counts={{ pending: pendingCount, approved: approvedCount, denied: deniedCount }}
      />

      <table>
        <thead>
          <tr>
            <th id="header-start">No.</th>
            <th>Name</th>
            <th>National ID</th>
            <th>Loan Amount</th>
            <th>Credit Score</th>
            <th>Details</th>
            <th id="header">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentLoans.length > 0 ? (
            currentLoans.map((loan, idx) => (
              <tr key={loan.loan_id} style={{ height: "56px" }}>
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
                <td className="denied-status">Denied</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ color: "#888" }}>
                No denied loans.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Denied;
