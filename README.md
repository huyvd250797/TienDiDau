# Tiền Đi Đâu — V1.1.0 Wallets & Categories

Phiên bản dữ liệu đầu tiên sau baseline V1.0.3 CleanDeploy.

## Mục tiêu

V1.1.0 tạo nền để V1.2.0 có thể nhập giao dịch thật:

- Onboarding tạo ví đầu tiên.
- CRUD mềm cho Ví: thêm, sửa, ẩn/hiện, đổi ví mặc định.
- CRUD mềm cho Danh mục Thu/Chi: thêm, sửa, ẩn/hiện.
- 20 danh mục mặc định không bị tạo trùng.
- Lưu `initialBalance` và `currentBalance` dạng Number nguyên VND.
- `currentBalance = initialBalance` khi tạo ví.
- Cấu trúc sẵn `transactionCount` để khóa các field nhạy cảm khi V1.2.0 có giao dịch.
- Firebase Anonymous Auth chạy ngầm; không có màn hình đăng nhập.
- Firestore là nguồn dữ liệu chính; Local Mode là fallback nếu Firebase không sẵn sàng.
- Draft form được giữ trong localStorage nếu lưu thất bại/mất mạng.

## Stack

- Next.js 16
- React 19
- TypeScript
- CSS native
- Firebase Web SDK
- Firebase Anonymous Auth
- Cloud Firestore
- Static export → Netlify

Không Firebase Admin, không API Route, không Netlify Function, không Tailwind, không thư viện state/chart.

## Cấu trúc dữ liệu V1.1.0

```text
users/{uid}
workspaces/{workspaceId}
workspaces/{workspaceId}/settings/general
workspaces/{workspaceId}/wallets/{walletId}
workspaces/{workspaceId}/categories/{categoryId}
```

### Wallet

```text
id
workspaceId
name
type
icon
color
initialBalance
currentBalance
startDate
status: active | hidden
isDefault
transactionCount
createdAt / updatedAt
createdBy / updatedBy
isDeleted
schemaVersion
```

### Category

```text
id
workspaceId
name
type: income | expense
icon
color
sortOrder
isDefault
status: active | hidden
transactionCount
createdAt / updatedAt
createdBy / updatedBy
isDeleted
schemaVersion
```

## Nghiệp vụ chính

- Workspace có tối đa một ví mặc định đang active.
- Ví đầu tiên tự trở thành mặc định.
- Không thể ẩn ví mặc định nếu chưa chọn ví active khác thay thế.
- Không hard-delete ví/danh mục ở V1.1.0.
- Nếu ví đã có `transactionCount > 0`, số dư ban đầu bị khóa trên form sửa.
- Nếu danh mục đã có `transactionCount > 0`, loại Thu/Chi bị khóa.
- Danh mục mặc định được seed idempotent theo ID cố định.

## Firebase

Giữ 6 biến Netlify:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Bật Authentication → Anonymous.

Sau khi deploy source, copy `firestore.rules` vào Firebase Console → Firestore → Rules → Publish.

## Build

```bash
npm install
npm run typecheck
npm run build
```

Next.js xuất site tĩnh vào `out/`, Netlify đã được cấu hình trong `netlify.toml`.

## Phạm vi chưa làm

Đúng roadmap, V1.1.0 **không** triển khai:

- Thu nhập
- Chi tiêu
- Chuyển tiền
- Balance engine theo transaction
- Lịch sử giao dịch
- Báo cáo thật
- Backup/Restore

Các chức năng Thu/Chi/Chuyển tiền bắt đầu ở V1.2.0 Transactions Core.
