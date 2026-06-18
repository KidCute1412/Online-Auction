# Kế Hoạch Nâng Cấp Hệ Thống Đấu Giá Trực Tuyến (Reflourish Online Auction)

Dự án này sẽ được nâng cấp toàn diện từ một ứng dụng Web Đấu giá cơ bản thành một hệ thống **Production-Ready** tối ưu, có kiến trúc phân tầng rõ ràng, áp dụng caching, message queue, AI và containerization. Đây sẽ là một dự án nổi bật trong CV để gây ấn tượng mạnh với nhà tuyển dụng.

---

## Các Thành Phần Chính Của Kế Hoạch

### 1. Backend Architecture Refactoring (Kiến Trúc Phân Tầng & Clean Code)
Tái cấu trúc Backend từ mô hình MVC thô (Controller truy cập trực tiếp Database qua Model chứa SQL raw) sang kiến trúc phân tầng rõ ràng:
`Routing -> Validation Middleware -> Controller -> Business Service -> Model/Repository -> DB`.

- **Middleware bắt lỗi tập trung**: Định nghĩa một global error middleware để bắt mọi ngoại lệ và trả về JSON định dạng chuẩn.
- **Custom App Errors**: Khai báo các lớp lỗi chuẩn hóa như `BadRequestError`, `UnauthorizedError`, `NotFoundError` kế thừa từ `Error` cơ bản.
- **Uniform Response Format**: Hàm helper trả về response chuẩn (`success`, `error`, `data`) để dễ dàng làm việc ở Frontend.
- **Service Layer**:
  - `auth.service.ts`: Xử lý xác thực, đăng ký, OTP.
  - `product.service.ts`: Xử lý logic truy vấn sản phẩm và caching.
  - `bid.service.ts`: Xử lý logic đấu giá dập tắt race condition (dùng transaction locking).
- **Socket.io Decoupling**: Đóng gói Socket.io thành một service riêng để phát/thu tín hiệu dễ dàng mà không bị circular dependency.

---

### 2. Redis Integration (Caching & Rate Limiting)
Tích hợp Redis nhằm giảm tải database cho các request đọc nhiều, đồng thời bảo vệ hệ thống khỏi spam request.

- **Redis Caching**:
  - Cache cây danh mục sản phẩm (Categories Tree).
  - Cache danh sách Top sản phẩm nổi bật (gần kết thúc, hot nhất, nhiều lượt bid nhất).
  - Cache chi tiết sản phẩm. Tự động xoá (invalidate) cache khi có người chơi đấu giá thành công để dữ liệu luôn chính xác.
- **Rate Limiting**:
  - Middleware giới hạn request dựa trên Redis.
  - Áp dụng giới hạn tần suất gửi OTP, đăng nhập và đặt giá đấu (`playBid`) để ngăn chặn spam bot phá hoại phiên đấu giá.

---

### 3. RabbitMQ Integration (Hàng Đợi Email Không Đồng Bộ)
Thay thế việc gửi email trực tiếp (gây block request API) bằng kiến trúc gửi không đồng bộ thông qua Message Broker.

- **Publisher-Consumer Pattern**:
  - Backend đóng vai trò Publisher gửi các tác vụ email dạng JSON vào RabbitMQ.
  - Xây dựng một Worker độc lập (Consumer) lắng nghe hàng đợi `email_queue` để thực thi gửi email qua Nodemailer.
- **Các tác vụ chuyển sang queue**:
  - Gửi OTP xác thực khi đăng ký.
  - Gửi mail thắng đấu giá (cho cả Winner và Seller).
  - Gửi mail cảnh báo bị vượt giá (Outbid) cho người trả giá cao nhất trước đó.

---

### 4. Chatbot AI Integration (Trợ Lý Đấu Giá Thông Minh)
Xây dựng một chatbot AI tích hợp trong hệ thống giúp tư vấn đấu giá, tra cứu sản phẩm nhanh và hỏi đáp điều khoản sử dụng.

- **Gemini API**: Kết nối với mô hình `gemini-1.5-flash` để trả lời nhanh.
- **Function Calling (Tool Use)**:
  - Định nghĩa công cụ `search_products(query)` để AI tự tìm sản phẩm trong database theo từ khoá hoặc khoảng giá.
  - Định nghĩa công cụ `get_product_detail(id)` để AI xem trạng thái chi tiết của sản phẩm.
  - Định nghĩa công cụ `get_auction_rules()` để trả lời các quy chế sử dụng.
- **Giao diện nổi (Floating UI)**: Thiết kế đẹp mắt góc phải màn hình, hỗ trợ markdown, gõ chữ real-time (typing status) và các nút bấm gợi ý câu hỏi nhanh.

---

### 5. Dockerization & Deployment (Docker Compose Toàn Diện)
Đóng gói toàn bộ ứng dụng và các dịch vụ đi kèm vào môi trường container để chạy thống nhất ở bất kỳ đâu.

- **Dockerfiles**:
  - `Backend/Dockerfile`: Đóng gói ứng dụng NodeJS + TypeScript.
  - `Frontend/Dockerfile`: Sử dụng Nginx để chứa trang React SPA đã build, đồng thời làm reverse proxy chuyển hướng `/api` và `/socket.io` về Backend container.
- **docker-compose.yml**:
  - `postgres`: Khởi tạo database và tự động chạy schema SQL.
  - `redis`: Lưu trữ cache và xử lý rate limit.
  - `rabbitmq`: Đảm nhiệm truyền tải thông điệp email.
  - `backend` & `frontend`.
- **Hướng dẫn deploy**: File markdown chi tiết cách deploy dự án lên Render, Railway hoặc AWS.

---

### 6. Performance & Load Testing với k6 (Kiểm Thử Hiệu Năng)
Ghi điểm cộng lớn trong CV bằng việc có số liệu thống kê chứng minh tối ưu hóa hiệu quả thông qua k6:

- **read_cache_test.js**: Kiểm thử việc gọi các API đọc thông tin danh mục, sản phẩm để so sánh tốc độ phản hồi khi có Redis Cache vs không có Cache.
- **bidding_stress_test.js**: Mô phỏng tải cao đặt giá liên tục trên cùng sản phẩm để test độ trễ và khả năng chống tranh chấp (race condition).
- **Report Template**: Bảng ghi nhận thông số Latency p95, p99, Error Rate, Requests Per Second (RPS) để dán trực tiếp vào CV hoặc file README.md của dự án.
