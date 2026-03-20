export const APIHandler = async (route, method = "GET", body, options = {}) => {
  try {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;
    const url = route.startsWith("/") ? route : `/${route}`;

    const res = await fetch(url, {
      method,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
      headers: isFormData
        ? options.headers
        : {
            "Content-Type": "application/json",
            ...options.headers,
          },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to fetch");
    }

    return data;
  } catch (e) {
    console.error(e);
    return { success: false, error: e.message };
  }
};
