# Hotfix Netlify ERR_REQUIRE_ESM

## Lỗi đã xử lý

```text
ERR_REQUIRE_ESM: require() of ES Module jose/dist/webapi/index.js
from jwks-rsa/src/utils.js not supported
```

## Cách cập nhật

1. Ghi đè source repository bằng nội dung phiên bản này.
2. Commit và push lên nhánh `main`.
3. Vào Netlify → Deploys → Trigger deploy → **Clear cache and deploy site**.
4. Kiểm tra `/api/health`; endpoint phải trả JSON và phiên bản `1.1.1`.
5. Đăng xuất khỏi app rồi đăng nhập Google lại.

## Không cần thay đổi

- Không cần tạo lại Firebase project.
- Không cần đổi Web API key.
- Không cần tạo lại service-account key nếu ba biến `FIREBASE_ADMIN_*` đã đúng.
- Không cần sửa Firestore Rules chỉ vì lỗi ESM này.
