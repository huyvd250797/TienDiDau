# Build Status — V1.1.1 NetlifyDeployFix

Ngày đóng gói: **2026-08-05**

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
- Node.js được khóa ở 22.16.0 và npm ở 10.9.7 trên Netlify, local và GitHub Actions.
- Phiên bản dependency được ghim chính xác trong `package.json`.
- ZIP được kiểm tra sau khi đóng gói.

## Giới hạn kiểm tra

Môi trường đóng gói chỉ truy cập registry nội bộ và registry này chưa có đầy đủ các package phiên bản mới, vì vậy chưa thể:

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

## V1.1.1 deployment runtime

- Node.js: 22.16.0
- npm: 10.9.7
- Netlify build command: `npm run build`
- Next.js build command: `next build`
- Cần Clear cache and deploy sau khi push.
