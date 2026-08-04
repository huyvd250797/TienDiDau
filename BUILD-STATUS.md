# Build Status — Phase 1

Ngày đóng gói: **2026-08-03**

## Đã kiểm tra

- Cấu trúc thư mục và source đầy đủ.
- Các file JSON đọc hợp lệ.
- TypeScript/TSX đã được kiểm tra cú pháp bằng compiler có sẵn trong môi trường.
- Không có `.env.local`, service account hoặc private key thật.
- File ZIP đã được kiểm tra tính toàn vẹn sau khi nén.

## Giới hạn kiểm tra

Môi trường tạo source không truy cập được npm registry, nên chưa thể tải `node_modules`, sinh `pnpm-lock.yaml`, chạy `pnpm build`, ESLint hoặc Prettier bằng đúng dependency của dự án.

Sau khi giải nén, chạy:

```bash
corepack enable
pnpm install
pnpm typecheck
pnpm lint
pnpm build
```
