# Deploy nhanh lên Vercel

1. Tạo Firebase Project và bật **Cloud Firestore**.
2. Firebase Console → Project settings → Service accounts → **Generate new private key**.
3. Push folder source này lên GitHub (không push `.env.local` hay file JSON private key).
4. Vercel → Add New Project → Import GitHub repository.
5. Thêm Environment Variables:
   - `APP_USERNAME=HuyVo`
   - `APP_PASSWORD_HASH` → tạo bằng `npm run hash-password -- "mật-khẩu"`
   - `SESSION_SECRET` → chuỗi ngẫu nhiên >= 32 ký tự
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
6. Deploy.
7. Trong Firebase Firestore Rules, dùng nội dung `firestore.rules` của source để chặn client truy cập trực tiếp.

Sau lần đăng nhập đầu tiên, app tự tạo danh mục mặc định và ví `Tiền mặt`.
