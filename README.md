# Tiền Đi Đâu — V1.2.0 Transactions Core

Baseline: **V1.1.0 Wallets & Categories**. Phiên bản này triển khai lõi giao dịch theo roadmap tổng thể, vẫn giữ kiến trúc Lite: **Next.js + React + TypeScript + Firebase Web SDK + Cloud Firestore**, truy cập trực tiếp bằng Firebase Anonymous Auth chạy ngầm.

## Phạm vi V1.2.0

### Thu nhập
- Ngày giao dịch.
- Số tiền nguyên VND.
- Ví.
- Danh mục Thu.
- Ghi chú không bắt buộc.
- Lưu giao dịch và cộng số dư ví trong cùng Balance Engine.

### Chi tiêu
- Ngày giao dịch.
- Số tiền.
- Ví.
- Danh mục Chi.
- Ghi chú.
- Nếu số tiền lớn hơn số dư: hiển thị cảnh báo và yêu cầu xác nhận, nhưng vẫn cho phép lưu.
- Lưu giao dịch và trừ số dư ví.

### Chuyển tiền
- Ví nguồn và ví đích phải khác nhau.
- Số tiền > 0.
- Không có danh mục.
- Trừ ví nguồn, cộng ví đích.
- Không tính là Thu hoặc Chi.
- Nếu nguồn không đủ số dư: cảnh báo nhưng vẫn cho phép xác nhận.

### Sửa / Xóa giao dịch
- Có thể đổi loại, ngày, số tiền, ví, danh mục và ghi chú.
- Khi sửa: hoàn tác tác động cũ rồi áp dụng tác động mới.
- Khi đổi ví: hoàn tác ví cũ và cập nhật ví mới.
- Xóa dùng `isDeleted = true`; không hard delete.
- Xóa tự hoàn tác số dư và `transactionCount`.

### Balance Engine
File chính:

```text
features/transactions/balance-engine.ts
features/transactions/repository.ts
```

Các thay đổi số dư ví, transaction count và document giao dịch được thực hiện trong cùng **Firestore transaction** ở Cloud Mode. Local Mode dùng cập nhật đồng bộ localStorage kèm best-effort rollback.

Các case đã kiểm tra bằng pure balance engine:
- Income create.
- Expense create/edit.
- Income → Expense.
- Đổi wallet/category khi sửa.
- Transfer create.
- Transfer đổi nguồn/đích.
- Delete transfer / hoàn tác.

## Emoji tùy chỉnh

Ngoài danh sách icon mặc định, form **Ví** và **Danh mục** có thêm ô:

```text
Icon / Emoji
→ Chạm "Chạm để chọn Emoji 😀"
→ mở bàn phím Emoji iPhone/Android
→ chọn emoji bất kỳ
```

Emoji được lưu trực tiếp trong field `icon`, không cần thư viện icon/emoji mới. Các icon category mặc định dạng token cũ vẫn được hỗ trợ để dữ liệu V1.1.0 không bị hỏng.

## Giao diện V1.2.0
- Nút FAB `+` mở menu nhanh Thu / Chi / Chuyển.
- Trang Giao dịch có nút thêm nhanh và tab cơ bản.
- Danh sách giao dịch cho phép Sửa / Xóa ngay để test Transaction Core.
- Dashboard hiển thị tổng Thu/Chi tháng hiện tại ở mức integration cơ bản.
- Dashboard nâng cao, filter/search/pagination/chart vẫn thuộc V1.3.0 / V1.4.0 đúng roadmap.

## Dữ liệu transaction

```text
workspaces/{workspaceId}/transactions/{transactionId}
```

Các field chính:

```text
id
workspaceId
type: income | expense | transfer
amount: Number nguyên
dateKey: YYYY-MM-DD
transactionAt: Firestore Timestamp
timezone
note
walletId
categoryId
sourceWalletId
destinationWalletId
walletName / walletIcon / walletColor snapshot
categoryName / categoryIcon / categoryColor snapshot
sourceWalletName / sourceWalletIcon snapshot
destinationWalletName / destinationWalletIcon snapshot
createdAt / createdBy
updatedAt / updatedBy
isDeleted
schemaVersion
```

Snapshot chỉ phục vụ lịch sử hiển thị. ID vẫn là nguồn tham chiếu chính.

## Firestore Rules

**Bắt buộc publish lại `firestore.rules` của V1.2.0** sau deploy. Rules mới cho phép đúng Anonymous UID thao tác:
- wallets
- categories
- transactions
- settings

và validate transaction type/amount/date/wallet/category cơ bản.

## Deploy

Source tiếp tục dùng static export:

```text
npm run build
→ out/
→ Netlify publish out
```

Không có:
- Google Login bắt buộc.
- Firebase Admin.
- Service account runtime.
- Next.js API route.
- Netlify Function.
- Tailwind / shadcn / Zustand / Zod / chart library.

## Firebase environment variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Authentication → Anonymous phải được bật.

## Giai đoạn chưa làm

Đúng roadmap, V1.2.0 chưa mở rộng sang:
- Lịch sử nâng cao + filter/search/pagination: V1.3.0.
- Dashboard tháng hoàn chỉnh và biểu đồ: V1.3.0/V1.4.0.
- Backup/Restore: V1.5.0.
- PWA/offline queue hoàn chỉnh: V1.6.0.
- Family/Google account linking: V2.2.0.
