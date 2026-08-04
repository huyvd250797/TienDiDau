# Changelog

## 1.1.0-auth-bootstrap — 2026-08-04

### Added

- Google Login bằng Firebase Authentication.
- Firebase Auth local persistence và tự động khôi phục phiên.
- Login, Auth Splash, Auth Guard và Error UI.
- User menu, avatar Google, hồ sơ và đăng xuất.
- `POST /api/auth/bootstrap` xác minh Firebase ID Token bằng Admin SDK.
- Tạo user, personal workspace, owner member và settings mặc định.
- Tạo 20 danh mục mặc định với ID ổn định.
- Firestore Transaction bảo đảm bootstrap đồng bộ và idempotent.
- Kiểm tra workspace owner/member role trước khi cho phép bootstrap tiếp tục.
- Firestore Security Rules theo workspace membership.
- Storage Rules đóng hoàn toàn trong V1.1.0.
- Zod validation cho bootstrap API response.
- Unit test cho bộ danh mục mặc định.
- GitHub Actions quality workflow.
- Cấu hình Netlify và tài liệu deploy Firebase.
- Node.js 24 LTS cho Netlify và GitHub Actions.
- Dependency versions được ghim chính xác trong `package.json`.

### Changed

- Dashboard mẫu được thay bằng Dashboard trạng thái tài khoản thật.
- Header hiển thị avatar, tên và email của người dùng.
- Các route nghiệp vụ được bảo vệ bởi Auth Guard.
- Health API nâng lên version 1.1.0.
- Package version nâng từ 1.0.0 lên 1.1.0.

### Security

- Client không được tự tạo user/workspace/member/settings/category.
- UID chỉ lấy từ Firebase ID Token đã xác minh.
- Firebase Admin credentials chỉ dùng phía server.
- Wallet, Transaction và Storage bị deny cho tới phase tương ứng.

## 1.0.0-foundation — 2026-08-03

### Added

- Khởi tạo Next.js App Router bằng TypeScript Strict Mode.
- Tailwind CSS 4 và design tokens Dark/Light/System.
- Responsive App Shell theo thiết kế mobile đã duyệt.
- Firebase Client/Admin, Emulator và environment template.
- ESLint, Prettier, path alias và tài liệu dự án.
