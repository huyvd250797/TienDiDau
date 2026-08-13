# Tiền Đi Đâu — V1.1.3 Direct Access

Bản tối giản của Tiền Đi Đâu dành cho nhu cầu ghi chép thu chi hằng ngày.

## Thay đổi chính

- Bỏ màn hình Google Login.
- Mở website là dùng trực tiếp.
- Firebase Authentication Anonymous chạy ngầm để tạo UID riêng cho dữ liệu.
- Bỏ Firebase Admin SDK, service-account và API bootstrap phía server.
- Bỏ toàn bộ Netlify Functions của app ở phiên bản này.
- Next.js build thành static export (`out/`) để deploy Netlify nhẹ và ổn định hơn.
- Firestore vẫn lưu user, workspace, settings và 20 danh mục mặc định.
- Giữ Dark / Light / System, responsive desktop/tablet/mobile.
- Chuẩn bị sẵn dữ liệu nền cho V1.2.0 Wallets & Categories.

## Công nghệ

- Node.js 24 LTS — môi trường build.
- Next.js 16 App Router.
- React 19 + TypeScript 5.8 Strict.
- Tailwind CSS 4.
- Firebase Web SDK.
- Firebase Anonymous Authentication.
- Cloud Firestore + offline cache.
- Netlify static hosting.

## Luồng truy cập

```text
Mở website
→ Firebase kiểm tra phiên cũ
→ Chưa có phiên: tự signInAnonymously()
→ Có UID: tạo/đọc user + workspace + settings + categories trực tiếp qua Firestore
→ Mở Dashboard
```

Người dùng không thấy màn hình đăng nhập.

## Firebase cần bật

Trong Firebase Console:

```text
Authentication
→ Sign-in method
→ Anonymous
→ Enable
```

Google provider có thể giữ nguyên nhưng V1.1.3 không sử dụng.

## Biến Netlify cần giữ

Chỉ còn 6 biến Firebase Web:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Ba biến `FIREBASE_ADMIN_*` không còn được sử dụng và có thể xóa khỏi Netlify.

## Firestore Rules

Bắt buộc publish file `firestore.rules` của V1.1.3. Rules cho phép UID hiện tại truy cập đúng workspace cá nhân `personal-{uid}` và tạo dữ liệu nền lần đầu.

## Deploy GitHub → Netlify

1. Ghi đè source bằng V1.1.3.
2. Commit/push lên `main`.
3. Netlify tự chạy `npm run build`.
4. Output tĩnh được publish từ thư mục `out`.

Không còn `/api/health` và `/api/auth/bootstrap` vì bản này không chạy server function.

## Lưu ý dữ liệu ẩn danh

Firebase giữ anonymous session bằng local persistence. Nếu người dùng xóa toàn bộ dữ liệu website/cookie hoặc dùng trình duyệt/thiết bị khác, Firebase có thể cấp UID mới. Vì vậy:

- Không xóa Site Data trước khi Backup/Restore được hoàn thành.
- V1.6.0 vẫn phải có Backup JSON/Restore.
- Sau này có thể thêm tùy chọn liên kết Google để giữ cùng UID và dữ liệu khi chuyển thiết bị.

## Phase tiếp theo

V1.2.0 Wallets & Categories:

- Onboarding tạo ví đầu tiên.
- CRUD ví.
- CRUD danh mục.
- Active/Hidden.
- Dữ liệu nền để V1.3.0 nhập Thu/Chi/Chuyển tiền.
