# TÀI LIỆU YÊU CẦU KHÁCH HÀNG (CRD) — DỰ ÁN DONEENGLISH

Tài liệu này tập trung vào trải nghiệm của người dùng (khách hàng) và các tính năng cụ thể mà hệ thống cung cấp để đáp ứng nhu cầu học tập của họ.

---

## 1. Chân dung người dùng (User Personas)

### 1.1. Người đi làm bận rộn (Busy Professional)
- **Mục tiêu**: Cải thiện vốn từ vựng và kỹ năng giao tiếp cơ bản để phục vụ công việc.
- **Nhu cầu**: Bài học ngắn gọn, dễ học trên thiết bị di động, theo dõi được tiến độ luyện tập hàng ngày.
- **Thách thức**: Ít thời gian, dễ bỏ cuộc nếu nội dung quá dài dòng.

### 1.2. Sinh viên ôn thi (Exam Student)
- **Mục tiêu**: Luyện tập các bài Quiz để củng cố kiến thức ngữ pháp và từ vựng cho các kỳ thi (Toeic, Ielts).
- **Nhu cầu**: Hệ thống câu hỏi đa dạng, chấm điểm tức thì, lộ trình phân theo cấp độ A1-C2.
- **Thách thức**: Cần sự phản hồi chính xác và hệ thống bài tập có tính thử thách.

## 2. Yêu cầu chức năng chi tiết (Functional Requirements)

### 2.1. Quản lý tài khoản và Hồ sơ (Account & Profile)
- **Đăng ký/Đăng nhập**: Email, mật khẩu, xác thực an toàn.
- **Cá nhân hóa**: Cập nhật ảnh đại diện, giới thiệu bản thân, thay đổi mục tiêu học tập (Du lịch, Công việc, Thi cử) và cấp độ hiện tại.

### 2.2. Khám phá nội dung học tập (Learning Content)
- **Chủ đề (Topics)**: Danh sách các chủ đề (Business, Daily Life, Travel...) được phân loại theo cấp độ.
- **Bài học (Lessons)**: Mỗi chủ đề chứa nhiều bài học nhỏ để người dùng không bị "ngợp".
- **Từ vựng (Vocabulary)**: Học từ mới kèm phiên âm, nghĩa tiếng Việt, ví dụ minh họa và âm thanh phát âm.

### 2.3. Luyện tập tương tác (Practice & Speaking)
- **Kỹ năng Nghe/Nói**: Truy cập các bài học Speaking để nghe mẫu và thực hành theo lộ trình.
- **Giao diện trực quan**: Các thẻ bài học được thiết kế tinh tế với animation mượt mà.

### 2.4. Đánh giá và Kiểm tra (Quiz & Testing)
- **Làm bài Quiz**: Giao diện làm bài chuyên nghiệp với đồng hồ đếm ngược, thanh điều hướng câu hỏi (Question Navigator).
- **Kết quả tức thì**: Sau khi nộp bài, hệ thống hiển thị số điểm, thời gian hoàn thành và đánh giá mức độ đạt yêu cầu.

### 2.5. Dashboard theo dõi tiến độ (Progress Dashboard)
- **Thống kê**: Xem tổng XP tích lũy, streak hiện tại (số ngày học liên tục) và cấp độ (A1-C2).
- **Biểu đồ**: Hiển thị sự tiến bộ qua các bài học theo thời gian.

## 3. Yêu cầu giao diện (UI/UX Requirements)
- **Tính thẩm mỹ**: Giao diện mang phong cách hiện đại (Premium design), sử dụng Glassmorphism và các màu sắc hài hòa.
- **Chế độ tối (Dark Mode)**: Tối ưu trải nghiệm nếu người dùng học tập vào ban đêm.
- **Hiệu ứng**: Sử dụng Framer Motion cho các chuyển cảnh mượt mà, tạo cảm giác "sống động" cho ứng dụng.
- **Tính tương thích**: Hiển thị tốt trên laptop, máy tính bảng và điện thoại di động.

## 4. Kịch bản sử dụng (User Scenarios)

**Kịch bản: Một ngày học tập của người dùng mới**
1. Người dùng đăng ký tài khoản và thiết lập mục tiêu là "Học để đi du lịch" với trình độ "A1".
2. Hệ thống gợi ý các chủ đề liên quan đến "Travel - Level A1".
3. Người dùng chọn bài học "At the Airport", học 5 từ vựng mới và nghe phát âm.
4. Sau khi học xong, người dùng thực hiện bài Quiz ngắn 5 câu để kiểm tra kiến thức.
5. Người dùng hoàn thành quiz, nhận 50 XP và Streak tăng lên 1 ngày.
6. Người dùng vào trang Profile để xem bảng thành tích mới nhất của mình.

## 5. Yêu cầu Quản trị (Admin Features)
- **Quản lý nội dung**: Dễ dàng thêm chủ đề mới hoặc bài học mới qua form admin.
- **Kiểm soát người dùng**: Admin có quyền khóa/mở tài khoản người dùng vi phạm hoặc cập nhật thủ công cấp độ cho học viên.

---
*NNPT — English Learning Platform Project 2025*
