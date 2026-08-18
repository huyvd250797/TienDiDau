# Changelog

## V1.2.0 — Transactions Core

### Added
- Thu nhập, Chi tiêu và Chuyển tiền.
- Balance Engine hoàn tác/áp dụng tác động giao dịch.
- Firestore transaction để cập nhật giao dịch + số dư ví đồng thời.
- Sửa giao dịch, kể cả đổi type/wallet/category.
- Soft delete giao dịch và hoàn tác số dư.
- `transactionCount` tự cập nhật cho wallet/category.
- Cảnh báo vượt số dư nhưng vẫn cho phép xác nhận.
- Draft giao dịch mới lưu localStorage.
- FAB mở menu Thu / Chi / Chuyển.
- Danh sách giao dịch Core với Sửa/Xóa.
- Dashboard integration cơ bản: Thu/Chi/Còn lại tháng hiện tại + 5 giao dịch gần đây.
- Custom Emoji picker cho Ví và Danh mục; dùng bàn phím emoji native trên iPhone/Android.
- `types/transaction.ts` và transaction snapshot fields.
- Firestore Rules cho transactions.

### Changed
- Version 1.1.0 → 1.2.0.
- Dashboard/Ví phản ánh `currentBalance` sau giao dịch.
- Onboarding copy cập nhật: có thể nhập giao dịch ngay trong V1.2.0.
- Default category icon token cũ vẫn được resolve sang emoji để backward compatible.

### Kept lightweight
- Không Firebase Admin.
- Không Google Login bắt buộc.
- Không server API / Netlify Function.
- Không thêm dependency mới.
