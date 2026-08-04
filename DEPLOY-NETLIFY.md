# Hướng dẫn deploy V1.1.0 bằng GitHub → Netlify

Tài liệu này dành cho quy trình làm hoàn toàn trên iPhone. Không cần chạy localhost.

# A. Cập nhật source lên GitHub

1. Giải nén `TienDiDau-V1.1.0-AuthBootstrap.zip`.
2. Trong Working Copy, mở repository `TienDiDau`.
3. Xóa hoặc ghi đè source V1.0.0 bằng nội dung V1.1.0.
4. Bảo đảm `package.json` nằm ngay thư mục gốc repository.
5. Commit với nội dung:

```text
Release V1.1.0 AuthBootstrap
```

6. Push lên nhánh `main`.

Netlify sẽ nhận push và bắt đầu deploy. Lần deploy đầu có thể thất bại nếu chưa thêm biến môi trường Firebase. Hãy thực hiện các phần dưới rồi chọn Retry deploy.

# B. Tạo Firebase Project

1. Mở Firebase Console.
2. Chọn **Add project**.
3. Đặt tên, ví dụ `TienDiDau`.
4. Có thể tắt Google Analytics nếu chưa cần.
5. Sau khi tạo xong, vào **Project settings**.

# C. Tạo Firebase Web App

1. Trong Project settings → General.
2. Chọn biểu tượng Web `</>`.
3. Đặt nickname: `TienDiDau Web`.
4. Không cần bật Firebase Hosting vì app deploy trên Netlify.
5. Firebase hiển thị config dạng:

```ts
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Giữ màn hình này để nhập vào Netlify.

# D. Bật Google Authentication

1. Firebase Console → Authentication.
2. Chọn **Get started**.
3. Tab **Sign-in method**.
4. Chọn **Google**.
5. Bật **Enable**.
6. Chọn email hỗ trợ dự án.
7. Save.

# E. Thêm domain Netlify được phép đăng nhập

1. Firebase Console → Authentication → Settings.
2. Mở **Authorized domains**.
3. Chọn **Add domain**.
4. Nhập đúng hostname Netlify, ví dụ:

```text
tiendidau.netlify.app
```

Không nhập `https://` và không nhập dấu `/` cuối.

Khi dùng custom domain, thêm cả custom domain vào đây.

# F. Tạo Firestore Database

1. Firebase Console → Firestore Database.
2. Chọn **Create database**.
3. Chọn **Production mode**.
4. Chọn location gần Việt Nam, ưu tiên Singapore nếu khả dụng.
5. Create.

Location không nên đổi sau khi đã tạo dữ liệu thật.

# G. Tạo Firebase Admin Service Account

1. Firebase Console → Project settings.
2. Tab **Service accounts**.
3. Chọn **Generate new private key**.
4. Xác nhận tải file JSON.
5. Mở file JSON và lấy ba giá trị:

```json
{
  "project_id": "...",
  "client_email": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

Ánh xạ sang Netlify:

```text
project_id   → FIREBASE_ADMIN_PROJECT_ID
client_email → FIREBASE_ADMIN_CLIENT_EMAIL
private_key  → FIREBASE_ADMIN_PRIVATE_KEY
```

Không upload file JSON này lên GitHub, iCloud dùng chung hoặc gửi qua tin nhắn.

# H. Thêm Environment Variables trên Netlify

Vào:

```text
Netlify
→ Project configuration
→ Environment variables
→ Add a variable
```

Thêm các biến:

```text
NEXT_PUBLIC_APP_NAME=Tiền Đi Đâu
NEXT_PUBLIC_APP_URL=https://ten-site.netlify.app
NEXT_PUBLIC_APP_ENV=production

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
```

Lưu ý với private key:

- Dán giá trị private key, không dán toàn bộ file JSON.
- Không thêm `NEXT_PUBLIC_`.
- Nếu Netlify không giữ xuống dòng, dùng chuỗi có ký tự `\n`; source đã tự chuyển lại thành newline.
- Không thêm dấu nháy bao quanh khi nhập trực tiếp trên giao diện Netlify.

Sau khi thêm biến, vào Deploys và chọn **Trigger deploy → Clear cache and deploy site**.

# I. Áp dụng Firestore Security Rules

Netlify không tự deploy Firestore Rules.

Cách trực tiếp trên iPhone:

1. Mở file `firestore.rules` trong GitHub.
2. Chọn xem Raw hoặc copy toàn bộ nội dung.
3. Firebase Console → Firestore Database → Rules.
4. Dán thay nội dung hiện tại.
5. Chọn **Publish**.

Rules V1.1.0:

- User chỉ đọc hồ sơ của chính mình.
- Chỉ thành viên active được đọc workspace.
- Client không được tự tạo hoặc sửa user/workspace/member/settings/category.
- Wallet và Transaction bị deny toàn bộ cho tới phase tương ứng.

# J. Áp dụng Storage Rules

1. Mở file `storage.rules` trong GitHub.
2. Firebase Console → Storage → Rules.
3. Dán nội dung và Publish.

V1.1.0 đóng toàn bộ Storage vì chưa có upload hóa đơn.

# K. Kiểm tra deploy

## 1. Health API

Mở:

```text
https://ten-site.netlify.app/api/health
```

Cần thấy:

```json
{
  "status": "ok",
  "version": "1.1.0",
  "firebaseClientConfigured": true,
  "firebaseAdminConfigured": true
}
```

Nếu một trong hai là `false`, kiểm tra lại Environment Variables rồi redeploy.

## 2. Google Login

1. Mở trang chính.
2. App phải chuyển tới `/login`.
3. Chọn **Tiếp tục với Google**.
4. Chọn tài khoản.
5. Sau bootstrap, app mở Dashboard.
6. Avatar, tên và email phải đúng.

## 3. Kiểm tra Firestore

Sau lần đăng nhập đầu tiên, Firebase Console phải có:

```text
users/{uid}
workspaces/personal-{uid}
workspaces/personal-{uid}/members/{uid}
workspaces/personal-{uid}/settings/general
workspaces/personal-{uid}/categories/{20 documents}
```

## 4. Kiểm tra đăng nhập lại

1. Đóng Safari.
2. Mở lại website.
3. App phải tự khôi phục phiên.
4. Firestore không được tạo workspace hoặc categories trùng.

## 5. Kiểm tra đăng xuất

1. Bấm avatar.
2. Chọn Đăng xuất.
3. Xác nhận.
4. App trở về Login.

# L. Xử lý lỗi thường gặp

## `auth/unauthorized-domain`

Thêm hostname Netlify vào Firebase Authentication → Authorized domains.

## `Google Sign-In chưa được bật`

Bật Google trong Authentication → Sign-in method.

## `Firebase Admin chưa được cấu hình`

Kiểm tra ba biến `FIREBASE_ADMIN_*`, sau đó Clear cache and deploy site.

## `Failed to parse private key`

- Xóa dấu nháy ngoài cùng.
- Bảo đảm key có BEGIN/END PRIVATE KEY.
- Dùng `\n` thay cho xuống dòng nếu cần.

## Health API đúng nhưng bootstrap lỗi

- Kiểm tra Firestore đã được tạo.
- Kiểm tra service account thuộc đúng Firebase Project.
- Kiểm tra `NEXT_PUBLIC_FIREBASE_PROJECT_ID` và `FIREBASE_ADMIN_PROJECT_ID` giống nhau.
