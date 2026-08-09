# Build Status — V1.1.2 Dependency Fix

## Mục tiêu hotfix

Khắc phục Netlify timeout ở bước `Install dependencies`.

## Thay đổi

- Pin `typescript` từ 6.x về `5.8.3`.
- Giữ `next` / `eslint-config-next` ở `16.2.12`.
- Giữ hotfix Firebase Admin ESM: `jwks-rsa -> jose 4.15.9`.
- Netlify dùng `npm install` với `--legacy-peer-deps --no-audit --no-fund` để tránh npm dành quá nhiều thời gian giải peer dependencies trong môi trường CI.
- Production build vẫn dùng `next build --webpack`.
- Phiên bản ứng dụng: `1.1.2`.

## Kiểm tra trong môi trường tạo source

- `package.json` parse hợp lệ.
- `netlify.toml` có cấu hình npm install ổn định hơn.
- Import nội bộ và source giữ nguyên ngoài version metadata.
- Không thể chạy `npm install` hoàn chỉnh trong môi trường đóng gói vì registry nội bộ không có đầy đủ package công khai. Netlify/GitHub Actions là nơi thực hiện build thực tế.

## Sau khi push GitHub

Trên Netlify chọn **Clear cache and deploy site** để loại bỏ dependency cache của bản TypeScript 6.x trước đó.
