export const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function fetchLoanApplications() {
  try {
    if (!baseUrl) {
      throw new Error("Base URL is not defined. Please set REACT_APP_BASE_URL.");
    }

    const url = `${baseUrl}/loans/`;  

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.status}`);
    }

    const result = await response.json();

    if (Array.isArray(result)) {
      return result;
    } else if (result && Array.isArray(result.loans)) {
      return result.loans;
    } else if (result && typeof result === 'object') {
      const arr = Object.values(result).find(v => Array.isArray(v));
      return arr || [];
    }

    return [];
  } catch (error) {
    throw new Error(error.message || "Error fetching loan applications");
  }
}