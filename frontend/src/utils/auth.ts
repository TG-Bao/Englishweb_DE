export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  level?: string;
  targetLevel?: string;
  learningGoal?: string;
  points?: number;
  totalXP?: number;
  totalLessons?: number;
  currentLevel?: string;
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

/**
 * Giải mã payload của JWT Token (phần ở giữa)
 */
export const decodeToken = (token: string | null) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Lỗi khi giải mã Token:", err);
    return null;
  }
};

/**
 * Kiểm tra xem người dùng hiện tại có phải là ADMIN dựa trên TOKEN đã ký
 * Điều này an toàn hơn so với việc chỉ kiểm tra role trong localStorage
 */
export const isAdminToken = () => {
  const token = getToken();
  const decoded = decodeToken(token);
  return decoded && decoded.role === "ADMIN";
};

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
