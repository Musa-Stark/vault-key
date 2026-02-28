export const apiCall = async (data, method = "GET", endpoint = "") => {
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: method !== "GET" ? JSON.stringify(data) : undefined,
    });

    const response = await res.json();

    return response;
  } catch (error) {
    console.log(error.message);
  }
};
