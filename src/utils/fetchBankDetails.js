export const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchBankDetails = async (bank_partner_id) => {
  try {
    const url = bank_partner_id
      ? `${baseUrl}/cooperative_partner_banks/${bank_partner_id}`
      : `${baseUrl}/cooperative_partner_banks/`;
    console.log("fetchBankDetails fetching URL:", url);

    const response = await fetch(url);
    if (!response.ok) {

      const errorText = await response.text();
      throw new Error(`Failed to fetch bank detail(s): ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bank details:', error);
    throw error;
  }

};
