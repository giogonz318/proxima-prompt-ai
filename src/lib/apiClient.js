export const apiClient = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let error;

    try {
      error = await res.json();
    } catch {
      error = { message: "Something went wrong" };
    }

    throw {
      status: res.status,
      ...error,
    };
  }

  return res.json();
};