export async function saveToken(key: string, token: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, token);
}

export async function getToken(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export async function deleteToken(key: string) {
  if (typeof window !== "undefined") window.localStorage.removeItem(key);
}
