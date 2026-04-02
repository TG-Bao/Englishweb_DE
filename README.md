# 🌐 EnglishHub — Nền tảng học tiếng Anh trực tuyến

> **EnglishHub** là ứng dụng web học tiếng Anh toàn diện, được xây dựng theo kiến trúc **Full-stack Monorepo** gồm Backend Node.js/Express và Frontend React/TypeScript.

---

## 📁 Cấu trúc dự án

```
Englishweb_DE/
├── backend/                    # Node.js + Express + TypeScript
│   └── src/
│       ├── app.ts              # Khởi tạo Express app
│       ├── server.ts           # Entry point
│       ├── config/             # Cấu hình môi trường
│       ├── controllers/        # Xử lý request/response
│       ├── services/           # Business logic
│       ├── repositories/       # Truy vấn MongoDB
│       ├── models/             # Kiểu dữ liệu & schema
│       ├── routes/             # Định nghĩa API routes
│       ├── middleware/         # Auth, error handler
│       ├── dtos/               # Data Transfer Objects
│       ├── interfaces/         # TypeScript interfaces
│       ├── validators/         # Validate input
│       └── utils/              # Tiện ích
└── frontend/                   # React + Vite + TypeScript
    └── src/
        ├── pages/              # Các trang chính
        ├── api/                # Axios client
        └── utils/              # auth.ts, helpers
```

---

## 🚀 Công nghệ sử dụng

### Backend
| Công nghệ | Vai trò |
|-----------|---------|
| Node.js + Express | Web framework |
| TypeScript | Kiểu dữ liệu tĩnh |
| MongoDB | Cơ sở dữ liệu NoSQL |
| JWT | Xác thực người dùng |

### Frontend
| Công nghệ | Vai trò |
|-----------|---------|
| React 18 + Vite | UI framework |
| TypeScript | Kiểu dữ liệu tĩnh |
| Framer Motion | Animation |
| Lucide React | Icon library |
| Axios | HTTP client |

---

## 📊 Mô hình dữ liệu — Người dùng (`User`)

```typescript
interface UserDocument {
  _id?: ObjectId;

  // ── Xác thực & Phân quyền ─────────────────
  name: string;
  email: string;
  password: string;           // Hashed (bcrypt)
  role: "USER" | "ADMIN";

  // ── Hồ sơ cá nhân ─────────────────────────
  avatarUrl?: string;         // URL ảnh đại diện
  phone?: string;             // Số điện thoại
  bio?: string;               // Giới thiệu bản thân
  dateOfBirth?: Date;         // Ngày sinh
  gender?: "MALE" | "FEMALE" | "OTHER";

  // ── Học tập ───────────────────────────────
  level?: "A1"|"A2"|"B1"|"B2"|"C1"|"C2";       // Cấp độ hiện tại
  targetLevel?: "A1"|"A2"|"B1"|"B2"|"C1"|"C2"; // Cấp độ mục tiêu
  learningGoal?: string;      // VD: "Du lịch", "Công việc"

  // ── Trạng thái ────────────────────────────
  isActive?: boolean;         // Tài khoản hoạt động / bị khoá
  lastLoginAt?: Date;         // Lần đăng nhập gần nhất

  // ── Thời gian ─────────────────────────────
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

## 🔌 API Endpoints

### 🔐 Auth (`/api/auth`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/register` | Đăng ký tài khoản |
| POST | `/login` | Đăng nhập, nhận JWT |
| GET | `/me` | Lấy thông tin người dùng hiện tại |

### 👥 Users (`/api/users`) — _ADMIN only_
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lấy danh sách toàn bộ người dùng |
| GET | `/:id` | Lấy thông tin một người dùng |
| PATCH | `/:id` | Cập nhật thông tin người dùng |
| DELETE | `/:id` | Xoá người dùng |
| GET | `/stats/count` | Tổng số người dùng |

### 📚 Topics (`/api/topics`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/all` | Lấy tất cả chủ đề |
| POST | `/` | Tạo chủ đề mới _(Admin)_ |
| PATCH | `/:id` | Cập nhật chủ đề _(Admin)_ |
| DELETE | `/:id` | Xoá chủ đề _(Admin)_ |

### 📖 Lessons (`/api/lessons`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/topic/:topicId` | Lấy bài học theo chủ đề |
| POST | `/` | Tạo bài học mới _(Admin)_ |
| PATCH | `/:id` | Cập nhật bài học _(Admin)_ |
| DELETE | `/:id` | Xoá bài học _(Admin)_ |

### 📝 Vocabulary (`/api/vocabulary`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/lesson/:lessonId` | Từ vựng theo bài học |
| POST | `/` | Thêm từ vựng mới _(Admin)_ |

### 🎯 Quiz (`/api/quiz`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/all` | Lấy tất cả bài kiểm tra |
| POST | `/` | Tạo bài kiểm tra _(Admin)_ |
| PATCH | `/:id` | Cập nhật _(Admin)_ |
| DELETE | `/:id` | Xoá _(Admin)_ |

### ❓ Questions (`/api/questions`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/quiz/:quizId` | Câu hỏi theo bài kiểm tra |
| POST | `/` | Thêm câu hỏi _(Admin)_ |
| PATCH | `/:id` | Cập nhật _(Admin)_ |
| DELETE | `/:id` | Xoá _(Admin)_ |

---

## 🖥️ Các trang Frontend

| Trang | Route | Mô tả |
|-------|-------|-------|
| Trang chủ | `/` | Landing page học tiếng Anh |
| Đăng nhập | `/login` | Form đăng nhập |
| Đăng ký | `/register` | Form đăng ký tài khoản |
| Dashboard Admin | `/admin` | Quản lý toàn bộ nội dung & người dùng |

---

## 🔑 Phân quyền

```
USER  → Học tập, xem nội dung, làm bài kiểm tra
ADMIN → Toàn bộ quyền USER + quản lý nội dung + quản lý người dùng
```

---

## ⚙️ Chạy dự án

### 1. Khởi động Backend

```bash
cd backend
npm install
npm run dev
# Mặc định chạy tại: http://localhost:5000
```

### 2. Khởi động Frontend

```bash
cd frontend
npm install
npm run dev
# Mặc định chạy tại: http://localhost:5173
```

### 3. Biến môi trường Backend (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/englishweb
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
```

---

## 🏗️ Kiến trúc Backend (Clean Architecture)

```
Request → Route → Middleware (Auth) → Controller → Service → Repository → MongoDB
                                           ↓
                                     Validator / DTO
```

- **Controller**: Nhận request, validate input cơ bản, gọi Service
- **Service**: Business logic, xử lý nghiệp vụ
- **Repository**: Tương tác trực tiếp với MongoDB
- **DTO**: Định nghĩa format dữ liệu vào/ra

---

## 📋 Tính năng Admin Dashboard

| Tính năng | Mô tả |
|-----------|-------|
| 📁 Quản lý Chủ đề | Thêm/sửa/xóa topic (kèm level A1-C2) |
| 📖 Quản lý Bài học | Thêm/sửa/xóa lesson gắn với topic |
| 📝 Quản lý Từ vựng | Thêm từ, nghĩa, ví dụ, phiên âm |
| 🎯 Quản lý Quiz | Tạo bài kiểm tra theo lesson/topic |
| ❓ Quản lý Câu hỏi | Thêm câu MCQ cho từng quiz |
| 👥 Quản lý Người dùng | Xem, sửa, khoá, xoá người dùng; cập nhật level |

---

## 👥 Trường thông tin User trong Admin

| Nhóm | Trường | Mô tả |
|------|--------|-------|
| **Cơ bản** | name, email, role | Thông tin bắt buộc |
| **Cơ bản** | avatarUrl | URL ảnh đại diện |
| **Hồ sơ** | phone | Số điện thoại |
| **Hồ sơ** | dateOfBirth | Ngày sinh |
| **Hồ sơ** | gender | Nam / Nữ / Khác |
| **Hồ sơ** | bio | Giới thiệu bản thân |
| **Học tập** | level | Cấp độ hiện tại (A1-C2) |
| **Học tập** | targetLevel | Cấp độ mục tiêu (A1-C2) |
| **Học tập** | learningGoal | Mục tiêu học (VD: Du lịch) |
| **Trạng thái** | isActive | Khoá / Mở tài khoản |
| **Trạng thái** | lastLoginAt | Lần đăng nhập cuối |
| **Hệ thống** | createdAt | Ngày tạo tài khoản |

---

*Dự án phát triển bởi nhóm NNPT — 2025*
