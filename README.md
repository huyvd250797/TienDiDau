# Tiền Đi Đâu — V1.1.0 AuthBootstrap

Phiên bản V1.1.0 triển khai nền tảng tài khoản cho ứng dụng quản lý thu chi **Tiền Đi Đâu**.

## Chức năng đã hoàn thành

- Đăng nhập Google bằng Firebase Authentication.
- Ghi nhớ phiên đăng nhập bằng `browserLocalPersistence`.
- Tự động khôi phục phiên khi mở lại ứng dụng.
- Màn hình Login, Splash, Loading và Error riêng.
- Bảo vệ Dashboard, Ví, Giao dịch, Báo cáo và Cài đặt.
- Firebase ID Token được gửi tới API backend và xác minh bằng Firebase Admin SDK.
- API bootstrap idempotent: gọi nhiều lần không tạo trùng dữ liệu.
- Tạo hồ sơ `users/{uid}` trong lần đăng nhập đầu tiên.
- Tạo workspace cá nhân `workspaces/personal-{uid}`.
- Tạo member owner và settings mặc định.
- Tạo 20 danh mục mặc định: 7 Thu và 13 Chi.
- Hiển thị avatar, họ tên, email, workspace và trạng thái phân quyền.
- Đăng xuất có hộp thoại xác nhận.
- Firestore Rules chỉ cho phép đọc dữ liệu thuộc workspace của thành viên đang hoạt động.
- Storage Rules đóng hoàn toàn trong V1.1.0.
- Cấu hình sẵn GitHub Actions và Netlify.

## Công nghệ

- Node.js 24 LTS
- Next.js App Router
- React + TypeScript Strict Mode
- Tailwind CSS 4
- Firebase Authentication
- Cloud Firestore
- Firebase Admin SDK
- Zod
- Vitest
- Netlify + GitHub continuous deployment
- Dependency versions được ghim chính xác trong `package.json`

## Luồng đăng nhập

```text
Người dùng bấm Tiếp tục với Google
→ Firebase Authentication trả về Firebase User
→ Client lấy Firebase ID Token
→ POST /api/auth/bootstrap
→ Firebase Admin xác minh token
→ Tạo/đồng bộ user, workspace, member, settings, categories
→ Trả hồ sơ an toàn về client
→ Mở Dashboard
```

## Cấu trúc dữ liệu

```text
users/{uid}

workspaces/{workspaceId}
├── members/{uid}
├── settings/general
└── categories/{categoryId}
```

Workspace cá nhân sử dụng ID ổn định:

```text
personal-{firebaseUid}
```

## Dữ liệu mặc định lần đầu

### User

- Avatar Google
- Họ tên Google
- Email Google
- Locale `vi-VN`
- Múi giờ `Asia/Ho_Chi_Minh`
- Workspace cá nhân

### Settings

- Theme: `dark`
- Currency: `VND`
- Date format: `dd/MM/yyyy`
- First day of week: Thứ Hai
- Onboarding step: `create-wallet`

### Categories

- 7 danh mục Thu.
- 13 danh mục Chi.
- ID và `systemKey` ổn định.
- Bootstrap không ghi đè danh mục đã tồn tại.

## Biến môi trường bắt buộc

### Firebase Web SDK

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Firebase Admin SDK

```env
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

Không thêm `NEXT_PUBLIC_` vào bất kỳ biến Firebase Admin nào.

## Deploy GitHub → Netlify

Xem hướng dẫn từng bước tại:

```text
DEPLOY-NETLIFY.md
```

Sau khi cấu hình, mỗi lần push lên nhánh `main`, Netlify sẽ tự động build và deploy.

## Kiểm tra sau deploy

Mở:

```text
https://your-site.netlify.app/api/health
```

Kết quả cần có:

```json
{
  "status": "ok",
  "version": "1.1.0",
  "phase": "auth-bootstrap",
  "firebaseClientConfigured": true,
  "firebaseAdminConfigured": true
}
```

Sau đó mở trang chính và đăng nhập Google.

## Chạy local, chỉ khi cần

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

## Kiểm tra chất lượng

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
npm run build
```

## Quy tắc bảo mật

- Không commit `.env.local`.
- Không commit Service Account JSON.
- Không commit Firebase Admin private key.
- Client không được tự tạo user, workspace hoặc member.
- Backend không tin `uid`, email hoặc tên gửi trực tiếp từ client.
- UID chỉ lấy từ Firebase ID Token đã được Admin SDK xác minh.
- Mọi collection đều có audit fields.
- Storage vẫn đóng cho tới V1.3.0.

## Phạm vi chưa thực hiện

- CRUD Ví và Danh mục bằng giao diện: V1.2.0.
- Thu, Chi, Chuyển tiền: V1.3.0.
- Dashboard dữ liệu thật và lịch sử: V1.4.0.
- Báo cáo: V1.5.0.
- Backup/Restore: V1.6.0.
- PWA production: V1.7.0.
