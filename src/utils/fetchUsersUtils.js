export const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function fetchUsers() {
  try {
    const response = await fetch(`${baseUrl}/users/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    throw error;
    
   
  }
}

