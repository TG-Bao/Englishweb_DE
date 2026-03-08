import { ObjectId } from "mongodb";

export type UserRole = "USER" | "ADMIN";
export type UserGender = "MALE" | "FEMALE" | "OTHER";
export type EngLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface UserDocument {
  _id?: ObjectId;

  // ── Xác thực & Phân quyền ─────────────────────────────────────
  name: string;
  email: string;
  password: string;
  role: UserRole;

  // ── Hồ sơ cá nhân ─────────────────────────────────────────────
  avatarUrl?: string;       // URL ảnh đại diện
  phone?: string;           // Số điện thoại
  bio?: string;             // Giới thiệu bản thân
  dateOfBirth?: Date;       // Ngày sinh
  gender?: UserGender;      // Giới tính

  // ── Học tập ────────────────────────────────────────────────────
  level?: EngLevel;         // Cấp độ tiếng Anh hiện tại (A1-C2)
  targetLevel?: EngLevel;   // Cấp độ mục tiêu muốn đạt
  learningGoal?: string;    // Mục tiêu học (VD: "Du lịch", "Công việc")

  // ── Trạng thái ─────────────────────────────────────────────────
  isActive?: boolean;       // Tài khoản đang hoạt động hay bị khoá
  lastLoginAt?: Date;       // Lần đăng nhập gần nhất

  // ── Thêm mới ───────────────────────────────────────────────────
  address?: string;         // Địa chỉ
  points?: number;          // Điểm tích lũy
  totalTopicsLearned?: number;    // Tổng số chủ đề đã hoàn thành

  // ── Thời gian ──────────────────────────────────────────────────
  createdAt?: Date;
  updatedAt?: Date;
}

export const USER_COLLECTION = "users";
