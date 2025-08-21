import { useState, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/loans/";

export default function useFetchLoanApplications() {
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoanApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch loan applications");
      }
      const data = await response.json();
      setLoanApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loanApplications, fetchLoanApplications, loading, error };
}