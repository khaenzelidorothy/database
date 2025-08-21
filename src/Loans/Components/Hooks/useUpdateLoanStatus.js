import { useState } from "react";

const statusMap = {
  approve: "approved",
  deny: "rejected",
  pending: "pending_approval",
};

export default function useUpdateLoanStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateLoanStatus(loanId, action) {
    setLoading(true);
    setError(null);
    const status = statusMap[action];
    if (!status) {
      setError("Action not recognized");
      setLoading(false);
      return;
    }
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!baseUrl) {
      setError("Missing API URL");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(baseUrl + "/loans/" + loanId + "/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      });
      if (!response.ok) {
        setError("Could not update loan status");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, updateLoanStatus };
}
