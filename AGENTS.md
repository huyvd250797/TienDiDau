# TienDiDau Development Notes

- Ngôn ngữ source: TypeScript, không thêm JavaScript thuần.
- UI mặc định: Dark Mode, mobile-first.
- Màu semantic: primary tím, income xanh lá, expense đỏ, balance xanh dương.
- Import nội bộ phải dùng alias `@/*`.
- Không truy cập Firebase Admin trong Client Component.
- Không commit `.env.local`, private key hoặc service account.
- Mọi thay đổi số dư ví trong phase nghiệp vụ phải chạy phía server bằng Firestore transaction.
- Modal/sheet phải khóa scroll nền và tôn trọng `prefers-reduced-motion`.
