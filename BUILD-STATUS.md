# Build Status — V1.1.3 Direct Access

## Kiến trúc

- Next.js static export (`output: export`).
- Không còn Firebase Admin SDK.
- Không còn Netlify server function cho auth/bootstrap.
- Firebase Anonymous Auth + Firestore chạy trực tiếp trên client.

## Kiểm tra cần chạy khi GitHub/Netlify có dependency

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

Netlify phải tạo thư mục `out/` và publish site tĩnh.

## Firebase production

Bắt buộc:

- Bật Anonymous Authentication.
- Publish `firestore.rules` của V1.1.3.
- Giữ 6 biến `NEXT_PUBLIC_FIREBASE_*`.

Không còn yêu cầu `FIREBASE_ADMIN_*`.
