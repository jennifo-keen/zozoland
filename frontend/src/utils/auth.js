export function readAuth() {
  const rawUser =
    localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {}
  return token && user ? user : null;
}