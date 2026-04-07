# TÀI LIỆU YÊU CẦU KINH DOANH (BRD) — DỰ ÁN DONEENGLISH

| Thông tin dự án | Chi tiết                                       |
| --------------- | ---------------------------------------------- |
| **Tên dự án**   | DoneEnglish — Nền tảng học tiếng Anh trực tuyến |
| **Phiên bản**   | 1.0.0                                          |
| **Ngày lập**    | 02/04/2026                                     |
| **Trạng thái**  | Hoàn thành                                     |

---

## 1. Tóm tắt dự án (Executive Summary)

DoneEnglish là hệ thống quản lý học tập (LMS) chuyên biệt cho việc học tiếng Anh. Dự án nhằm giải quyết vấn đề thiếu hụt các nền tảng học tập tập trung, có lộ trình rõ ràng và áp dụng cơ chế trò chơi hóa (gamification) để tăng tính tương tác và động lực cho người học.

## 2. Bối cảnh dự án (Project Background)

Trong kỷ nguyên số, nhu cầu học tiếng Anh ngày càng tăng cao nhưng nhiều học viên gặp khó khăn trong việc theo dõi tiến độ và duy trì thói quen học tập. DoneEnglish được phát triển để giúp người dùng học tập theo cấp độ (A1-C2) một cách có hệ thống, từ vựng đến ngữ pháp và giao tiếp.

## 3. Mục tiêu kinh doanh (Business Objectives)

- **Tăng tính cá nhân hóa**: Đưa ra lộ trình học dựa trên cấp độ hiện tại của người dùng.
- **Engagement (Tương tác)**: Sử dụng hệ thống XP, Streak và Level để giữ chân người dùng.
- **Quản lý tập trung**: Cung cấp công cụ Admin dashboard để quản lý bài giảng, đề thi một cách hiệu quả.
- **Khả năng mở rộng**: Hệ thống được thiết kế linh hoạt để có thể thêm mới chủ đề và bài học dễ dàng.

## 4. Các bên liên quan (Stakeholders)

1. **Người dùng (Users)**: Học sinh, sinh viên, người đi làm có nhu cầu học tiếng Anh.
2. **Quản trị viên (Admin)**: Người quản lý nội dung, kiểm duyệt câu hỏi và theo dõi báo cáo người dùng.
3. **Nhóm phát triển (BTNPT Team)**: Chịu trách nhiệm vận hành và nâng cấp kỹ thuật.

## 5. Yêu cầu chức năng cấp cao (High-level Functional Requirements)

- **Quản lý xác thực**: Đăng ký, đăng nhập bảo mật qua JWT.
- **Quản lý học tập**: Phân phối bài học theo Topic, Lesson và Level.
- **Hệ thống đánh giá**: Làm bài Quiz, chấm điểm tự động và lưu kết quả.
- **Theo dõi tiến độ**: Hiển thị XP, cấp độ hiện tại và lịch sử học tập.
- **Admin Dashboard**: Quản lý CRUD (Thêm, sửa, xóa) người dùng, chủ đề, bài học và ngân hàng câu hỏi.

## 6. Yêu cầu phi chức năng (Non-functional Requirements)

- **Hiệu năng**: Thời gian tải trang dưới 3 giây.
- **Bảo mật**: Thông tin cá nhân và mật khẩu được mã hóa (bcrypt), xác thực token.
- **Khả dụng (UI/UX)**: Giao diện hiện đại, tối ưu cho trình duyệt desktop và mobile (Responsive).
- **Độ tin cậy**: Hệ thống hoạt động ổn định 24/7.

## 7. Quy tắc hệ thống (System Rules)

- **Phân bậc level**: Sử dụng chuẩn Common European Framework (CEFR) gồm A1, A2, B1, B2, C1, C2.
- **Cơ chế XP**: Người dùng nhận XP sau khi hoàn thành bài học hoặc quiz.
- **Cơ chế Streak**: Đếm số ngày học liên tục để khích lệ học viên.

## 8. Tiêu chí thành công (Success Metrics)

- Tỷ lệ người dùng hoàn thành bài thi đạt trên 70%.
- Tỷ lệ duy trì (retention rate) hàng tuần ổn định.
- Thời gian trung bình học tập của người dùng mỗi ngày tăng dần.

---

_NNPT — English Learning Platform Project 2025_
