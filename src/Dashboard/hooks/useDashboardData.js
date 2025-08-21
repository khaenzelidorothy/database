import { useState, useEffect } from "react";
import { fetchLoanApplications } from "../../utils/fetchLoanApplications";
import { fetchRepayments } from "../../utils/fetchLoanRepaymentUtils";
import { fetchUsers } from "../../utils/fetchUsersUtils";
import {
  calculateTotals,
  prepareGeneralBarData,
  prepareCreditScorePieData,
} from "../../utils/dashboardUtils";

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowers, setBorrowers] = useState(0);
  const [disbursed, setDisbursed] = useState(0);
  const [repayment, setRepayment] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [generalBarData, setGeneralBarData] = useState({ labels: [], datasets: [] });
  const [creditScorePieData, setCreditScorePieData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchDashboardInfo() {
      try {
        setLoading(true);

        const [loans, repayments, users] = await Promise.all([
          fetchLoanApplications(),
          fetchRepayments(),
          fetchUsers(),
        ]);

        const totals = calculateTotals(loans, repayments, users);

        setBorrowers(totals.totalBorrowers);
        setDisbursed(totals.totalAmountRequested);
        setRepayment(totals.totalRepaymentPaid);
        setOutstanding(totals.totalOutstanding);

        setGeneralBarData(prepareGeneralBarData(totals));
        setCreditScorePieData(prepareCreditScorePieData(loans));

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardInfo();
  }, []);

  return {
    loading,
    error,
    borrowers,
    disbursed,
    repayment,
    outstanding,
    generalBarData,
    creditScorePieData,
  };
}