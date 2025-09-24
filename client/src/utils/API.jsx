export const apiRequest = async ({ method = "GET", endpoint, body = null }) => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return { success: true, data };
  } catch (error) {
    console.error(error.message);
    return { success: false, message: error.message };
  }
};
