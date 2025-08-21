const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function fetchLoans() {
  try {
    const response = await fetch(`${baseUrl}/loans/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch loans: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in fetchLoans:', error);
    throw error; 
    
  }
}
