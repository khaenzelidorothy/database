export const baseUrl = process.env.REACT_APP_API_BASE_URL;

 export async function fetchRepayments() {
  try {
    const response = await fetch(`${baseUrl}/loan_repayments/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch repayments: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
   
    console.error('Error in fetchRepayments:', error);
    
    throw error;
    
  }
}
