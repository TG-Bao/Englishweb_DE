import { Navigate } from "react-router-dom";
import { getToken, getUser, isAdminToken } from "../utils/auth";

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export const ProtectedRoute = ({ children, requireAdmin }: Props) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // SỬA LỖI BẢO MẬT: Kiểm tra quyền Admin dựa trên Token đã ký thay vì localStorage
  if (requireAdmin && !isAdminToken()) {
    console.warn("Cố gắng truy cập trái phép vào trang Admin!");
    return <Navigate to="/vocabulary" replace />;
  }

  return <>{children}</>;
};
