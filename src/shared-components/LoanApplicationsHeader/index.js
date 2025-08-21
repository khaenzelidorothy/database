import React from "react";
import "./style.css";

function LoanApplicationsHeader({
  navigate,
  activeTab,
  counts = {
    pending: 0,
    approved: 0,
    denied: 0,
  },
}) {
  return (
    <div className="header-row">
      <h2>Loan Applications</h2>
      <div className="tabs">
        <div
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => navigate("/loans")}
          style={{ cursor: "pointer" }}
        >
          Pending ({counts.pending})
        </div>
        <div
          className={`tab ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => navigate("/approved")}
          style={{ cursor: "pointer" }}
        >
          Approved ({counts.approved})
        </div>
        <div
          className={`tab ${activeTab === "denied" ? "active" : ""}`}
          onClick={() => navigate("/denied")}
          style={{ cursor: "pointer" }}
        >
          Denied ({counts.denied})
        </div>
      </div>
    </div>
  );
}

export default LoanApplicationsHeader;
