export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  level?: string;
  targetLevel?: string;
  learningGoal?: string;
  points?: number;
  totalLessons?: number;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  createdAt?: string | Date;
  address?: string;
};

const TOKEN_KEY = "el_token";
const USER_KEY = "el_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw || raw === "undefined") return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setAuth = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("user-updated"));
};

export const updateUser = (data: Partial<AuthUser>) => {
  const current = getUser();
  if (current) {
    const updated = { ...current, ...data };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("user-updated"));
    return updated;
  }
  return null;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
