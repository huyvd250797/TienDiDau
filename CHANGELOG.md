# Changelog

## V1.1.0 — Wallets & Categories

- Xây onboarding tạo ví đầu tiên.
- Thêm danh sách ví, tổng số dư ví active.
- Thêm form tạo/sửa ví: tên, loại, icon, màu, số dư đầu, ngày bắt đầu, ví mặc định.
- Thêm ẩn/hiện ví và luồng chuyển ví mặc định an toàn.
- Thêm `transactionCount` để chuẩn bị khóa field sau khi có giao dịch.
- Thêm màn hình Danh mục với tab Thu/Chi.
- Thêm tạo/sửa/ẩn/hiện danh mục mặc định và tùy chỉnh.
- Giữ 20 danh mục mặc định theo ID cố định, không tạo trùng.
- Thêm `defaultWalletId` và `onboardingCompleted` vào settings.
- Dashboard đọc số dư ví thật.
- Settings có shortcut quản lý danh mục và hiển thị ví mặc định.
- Thêm local fallback cho ví/danh mục/settings.
- Thêm lưu draft form localStorage khi thao tác chưa đồng bộ.
- Cập nhật Firestore Rules riêng cho wallet/category.
- Bổ sung `firestore.indexes.json` nền.
- Giữ nguyên kiến trúc Lite: không login bắt buộc, không Firebase Admin, không server function.

## V1.0.3 — Clean Deploy

- Baseline source root sạch.
- Next.js static export.
- Anonymous Firebase Auth.
- Firebase Web SDK + Firestore.
- CSS native, responsive, Dark Mode mặc định.
