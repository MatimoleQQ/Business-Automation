export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // 💥 GLOBAL AUTH HANDLING
  if (res.status === 401) {
    console.warn("401 Unauthorized → logging out user");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // optional cleanup
    localStorage.removeItem("user");

    window.location.href = "/login";

    return; // stop execution
  }

  return res;
}