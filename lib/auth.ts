// Simple password-based authentication for admin panel
const ADMIN_PASSWORD = "Iag2025.";

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAdminSession() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("admin_auth", "true");
  }
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_auth");
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("admin_auth") === "true";
}
