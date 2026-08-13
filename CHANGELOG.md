# Changelog

## V1.1.3 — Direct Access

- Tối giản kiến trúc theo mục tiêu ghi chép thu chi cá nhân.
- Bỏ màn hình Google Login và thao tác đăng xuất.
- Chuyển sang Firebase Anonymous Authentication tự động.
- Chuyển bootstrap user/workspace/settings/categories sang Firebase Web SDK.
- Loại bỏ `firebase-admin`, `zod`, service-account và backend auth route.
- Loại bỏ Netlify Functions; Next.js xuất site tĩnh vào `out/`.
- Loại bỏ Firebase Storage initialization khỏi bundle hiện tại.
- Cập nhật Firestore Rules cho workspace cá nhân theo UID.
- Dashboard và Settings bỏ các card kỹ thuật về Auth/Owner, tập trung vào bước tạo ví và ghi chép.
- Giữ TypeScript 5.8.3 để ổn định Netlify dependency install.

## V1.1.2 — Dependency Fix

- Pin TypeScript 5.8.3 và ổn định npm install trên Netlify.

## V1.1.1 — Netlify ESM Fix

- Hotfix xung đột Firebase Admin/Jose trên Netlify Functions.

## V1.1.0 — AuthBootstrap

- Google Login, user/workspace/settings/categories mặc định.
