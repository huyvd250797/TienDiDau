# TienDiDau Development Notes

- Bám theo `docs/ROADMAP.md` và tài liệu kế hoạch Word đã được Boss duyệt.
- Không chen chức năng của phase sau vào phase hiện tại nếu chưa được yêu cầu.
- Ngôn ngữ source: TypeScript Strict, không thêm JavaScript thuần.
- UI mặc định: Dark Mode, mobile-first, giữ phong cách đã duyệt.
- Màu semantic: primary tím, income xanh lá, expense đỏ, balance xanh dương.
- Import nội bộ phải dùng alias `@/*`.
- Không truy cập Firebase Admin trong Client Component.
- Không tin UID/email/name do client tự gửi; chỉ dùng Firebase ID Token đã xác minh.
- Không commit `.env.local`, private key hoặc Service Account JSON.
- Mọi thay đổi số dư ví trong phase nghiệp vụ phải chạy phía server bằng Firestore Transaction.
- Mọi collection/document nghiệp vụ phải có audit fields.
- Modal/sheet phải khóa scroll nền và tôn trọng `prefers-reduced-motion`.
- Sau mỗi đợt phải tạo ZIP source với tên ngắn, rõ version và nội dung, ví dụ `TienDiDau-V1.1.0-AuthBootstrap.zip`.
