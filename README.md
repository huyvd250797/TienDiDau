# Tiền Đi Đâu — Lite V1.0.0

Baseline mới được viết lại từ đầu theo mục tiêu: **nhẹ, mở là dùng, không Google Login, không Firebase Admin, không Netlify Function**.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5.8 Strict
- Tailwind CSS 4
- Firebase Web SDK modular
- Firebase Anonymous Authentication
- Cloud Firestore
- Node.js 24 LTS chỉ dùng cho build
- Netlify Static Export (`out/`)

## Kiến trúc

```text
Browser
  -> Next.js static app
  -> Firebase Anonymous Auth (tự chạy, không có màn hình login)
  -> Cloud Firestore
```

Không có:

- Google Login bắt buộc
- Firebase Admin SDK
- Service Account
- API Route
- Next.js server runtime
- Netlify Functions
- Recharts / Zustand / Zod / shadcn / Motion ở baseline

Các thư viện chỉ thêm khi chức năng thực sự cần.

## Firebase cần bật

1. Authentication -> Sign-in method -> Anonymous -> Enable.
2. Firestore Database -> tạo `(default)` database.
3. Firestore -> Rules -> dán nội dung `firestore.rules` -> Publish.

## Netlify Environment Variables

Giữ 6 biến client hiện tại:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Có thể xóa toàn bộ:

```text
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

## Deploy

Repository root phải có `package.json` và `netlify.toml`.

Netlify sẽ chạy:

```text
npm run build
```

và publish thư mục:

```text
out
```

Sau khi thay source cũ, nên dùng **Clear cache and deploy site** một lần.

## Dữ liệu khởi tạo

Lần mở đầu tiên trên một browser:

1. Firebase tạo Anonymous UID.
2. App tạo `users/{uid}`.
3. App tạo `workspaces/personal-{uid}`.
4. App tạo `settings/general`.
5. App tạo 20 danh mục mặc định.

Phiên đăng nhập anonymous dùng `browserLocalPersistence`, vì vậy không có thao tác login trên UI.

## Ghi chú dữ liệu

Cho đến khi có Backup/Restore hoặc liên kết tài khoản, không nên xóa toàn bộ Site Data của trình duyệt. Đây là baseline tạm thời trước khi triển khai nghiệp vụ Ví/Giao dịch.

## Bước phát triển tiếp theo

- CRUD Ví
- CRUD Danh mục
- Onboarding Ví đầu tiên
- Thu / Chi / Chuyển tiền
- Dashboard dữ liệu thật
- Backup / Restore
