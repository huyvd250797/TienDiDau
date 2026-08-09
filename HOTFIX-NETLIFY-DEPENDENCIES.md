# Hotfix V1.1.2 — Netlify dependency install timeout

## Triệu chứng

Netlify dừng ở `Install dependencies` và timeout sau khoảng 18 phút, kèm cảnh báo npm quanh TypeScript / eslint-config-next.

## Cách xử lý

1. Pin TypeScript ở `5.8.3` thay vì 6.x.
2. Thêm `NPM_FLAGS=--legacy-peer-deps --no-audit --no-fund` trong `netlify.toml`.
3. Giữ override `jwks-rsa -> jose 4.15.9` từ V1.1.1 để tránh lỗi Firebase Admin ESM khi chạy Netlify Function.
4. Giữ build bằng Webpack: `next build --webpack`.
5. Khi deploy bản này, dùng **Clear cache and deploy site**.

## Lưu ý kỹ thuật

`eslint-config-next` 16.x công bố peer TypeScript dạng `>=3.3.1`, vì vậy cảnh báo của npm không đồng nghĩa TypeScript 6 bị chặn bởi chính range đó. Việc pin TypeScript 5.8.3 ở hotfix này nhằm giảm rủi ro tương thích/resolution trong toàn bộ cây dependency và làm build CI ổn định hơn.
