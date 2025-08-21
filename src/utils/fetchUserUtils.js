const baseUrl = process.env.REACT_APP_API_BASE_URL;


const fetchUserUtils = async (phone, password) => {
  const url = `${baseUrl}/auth/login/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number: phone, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error("No token received");
  }

  localStorage.setItem("token", data.token);

  return data;
};

export { fetchUserUtils };