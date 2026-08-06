# Build Status — V1.1.1 Netlify ESM Fix

Ngày đóng gói: **2026-08-04**

## Đã kiểm tra trong môi trường đóng gói

- Cấu trúc source và tất cả local import `@/*` hợp lệ.
- Tất cả file TypeScript/TSX được parse bằng TypeScript compiler.
- Kiểm tra kiểu strict nội bộ với external module stubs đã đạt.
- Không phát hiện lỗi cú pháp TypeScript/TSX.
- `package.json` và các file JSON đọc hợp lệ.
- Firestore Rules và Storage Rules có cấu trúc đầy đủ.
- Mock Firestore Transaction xác nhận: lần đầu tạo 24 documents; đăng nhập lại không tạo trùng; role sai bị từ chối và không ghi dữ liệu dở dang.
- Bộ 20 danh mục có đúng 7 Thu, 13 Chi; ID và systemKey không trùng.
- Không chứa `.env.local`.
- Không chứa Service Account JSON.
- Không chứa Firebase private key thật.
- Không chứa `node_modules` hoặc output `.next`.
- Node.js được khóa ở nhánh 24 LTS trên Netlify và GitHub Actions.
- Phiên bản dependency được ghim chính xác trong `package.json`.
- ZIP được kiểm tra sau khi đóng gói.

## Giới hạn kiểm tra

Môi trường đóng gói không kết nối được npm registry, vì vậy chưa thể:

- tải `node_modules`;
- tạo lockfile chính xác từ registry;
- chạy `npm run typecheck` với type definitions thật;
- chạy ESLint/Prettier/Vitest;
- chạy production build của Next.js.

GitHub Actions đi kèm source sẽ chạy typecheck, lint, test và build sau khi Boss push lên GitHub. Netlify cũng sẽ chạy production build.

## Lệnh kiểm tra chuẩn

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run format:check
npm run build
```


## Hotfix kiểm tra tĩnh

- `package.json` hợp lệ và có npm override `jwks-rsa > jose = 4.15.9`.
- Production build được đổi sang `next build --webpack`.
- Health API không còn import trực tiếp `firebase-admin`.
- Không thể chạy `npm install` trong môi trường đóng gói do registry nội bộ không có dependency công khai; Netlify sẽ cài dependency khi deploy.
