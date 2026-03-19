export const APIHandler = async (route, type, body) => {
  try {
    const res = await fetch(`/${route}`, type, JSON.stringify(body));
    if (!res.ok) throw new Error("Failed to fetch");
    return res;
  } catch (e) {
    console.error(e);
    return;
  }
};
