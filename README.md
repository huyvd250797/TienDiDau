# Tiền Đi Đâu — TienDiDau V1.0.0

Web app quản lý thu chi cá nhân, mobile-first, nhẹ và dễ deploy.

## Stack
- Next.js 16.3 + React 19.2 + TypeScript
- Firebase Admin SDK + Cloud Firestore
- Không dùng Firebase Authentication ở V1
- Login cá nhân bằng cookie HttpOnly ký HMAC
- PWA cơ bản

## 1. Yêu cầu
- Node.js 22+
- Firebase project đã bật Cloud Firestore
- Vercel (khuyến nghị) hoặc Node.js hosting

## 2. Cài local
```bash
npm install
cp .env.example .env.local
```

### Tạo password hash
```bash
npm run hash-password -- "MAT_KHAU_CUA_BAN"
```
Copy kết quả vào `APP_PASSWORD_HASH` trong `.env.local`.

### Tạo SESSION_SECRET
Có thể chạy:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy kết quả vào `SESSION_SECRET`.

## 3. Firebase Admin
Firebase Console → Project settings → Service accounts → Generate new private key.

Từ file JSON, điền:
```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Hoặc stringify toàn bộ service account JSON và dùng `FIREBASE_SERVICE_ACCOUNT_JSON`.

## 4. Firestore Rules
Vì app chỉ truy cập Firestore từ server bằng Admin SDK, hãy deploy `firestore.rules` trong source. Rules này chặn toàn bộ client read/write.

## 5. Chạy
```bash
npm run dev
```
Mở http://localhost:3000

## 6. Deploy Vercel
1. Push source lên GitHub.
2. Import repository vào Vercel.
3. Project Settings → Environment Variables.
4. Thêm các biến trong `.env.example`.
5. Deploy.

**Không upload `.env.local` hoặc service-account JSON lên GitHub.**

## 7. Environment Variables bắt buộc
```env
APP_USERNAME=HuyVo
APP_PASSWORD_HASH=...
SESSION_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

## 8. Cấu trúc Firestore
```text
users/HuyVo
  accounts/{accountId}
  categories/{categoryId}
  transactions/{transactionId}
  budgets/{month_category}
```

Lần đầu truy cập app sẽ tự tạo ví `Tiền mặt` và danh mục mặc định.

## 9. Chức năng V1
- Login cá nhân, session 30 ngày
- Dashboard: số dư, thu/chi tháng, Tiền Đi Đâu, giao dịch gần đây
- Thêm thu / chi / chuyển tiền
- Sửa / xóa giao dịch
- Tìm kiếm + lọc nhanh giao dịch
- Quản lý ví
- Quản lý danh mục
- Ngân sách theo tháng/danh mục
- Thống kê donut + biểu đồ thu/chi
- Dark / Light mode
- Export CSV
- PWA / Add to Home Screen

## 10. Lưu ý bảo mật
- Password thật không nằm trong frontend.
- Cookie session là HttpOnly.
- Firebase private key chỉ ở server env.
- Firestore client bị deny all.
- `proxy.ts` chỉ redirect sớm; protected layout và API vẫn xác thực chữ ký session thực sự.

## Build production
```bash
npm run build
npm start
```
