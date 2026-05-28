export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    console.warn("Unauthorized - clearing session");

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.location.href = "/login";
    return;
  }

  return res;
}