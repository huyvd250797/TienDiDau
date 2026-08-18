# Build Status — V1.1.0

## Static checks đã thực hiện

- package.json hợp lệ, version 1.1.0.
- 15 file TypeScript/TSX trong source.
- Kiểm tra syntax TypeScript/TSX: 0 lỗi.
- Kiểm tra toàn bộ alias import `@/`: 0 import nội bộ bị thiếu.
- tsconfig đã include `features/**` và `types/**`.
- Source không chứa `src/` legacy, Firebase Admin, API Route, Zod hay Tailwind.
- Firestore Rules đã cập nhật cho wallet/category theo Anonymous UID.

## Production build

Môi trường đóng gói hiện tại không tải được npm dependencies trong thời gian cho phép, nên chưa chạy được `npm install && npm run build` với dependency thật.
Netlify sẽ là production build check sau khi push GitHub.

Nếu Netlify build lỗi, giữ nguyên source V1.1.0 và gửi log để fix đúng lỗi; không quay lại source AuthBootstrap cũ.
