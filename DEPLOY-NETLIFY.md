# Deploy V1.1.0 lên GitHub → Netlify

## 1. Cập nhật GitHub

Dùng source trong ZIP `TienDiDau-V1.1.0-WalletsCategories.zip` để thay source production hiện tại.

Root repository phải có trực tiếp:

```text
app/
components/
data/
features/
lib/
types/
package.json
netlify.toml
next.config.mjs
firestore.rules
```

Không đưa `node_modules`, `.next`, `out`, `.env.local` lên GitHub.

## 2. Netlify

`netlify.toml` đã cấu hình:

```text
Build command: npm run build
Publish directory: out
Node: 24
```

Giữ 6 biến `NEXT_PUBLIC_FIREBASE_*` đã có từ baseline.

Sau khi push `main`, Netlify sẽ tự build. Nếu Netlify dùng cache source/dependency cũ, chọn **Clear cache and deploy site**.

## 3. Firebase Authentication

Authentication → Sign-in method → Anonymous → Enable.

## 4. Firestore Rules

Mở file `firestore.rules` của V1.1.0:

Firebase Console → Firestore Database → Rules → thay toàn bộ rules → Publish.

V1.1.0 cần rules mới để cho phép wallet/category của đúng Anonymous UID.

## 5. Smoke test production

- Mở site không cần login.
- Workspace mới hiện onboarding Tạo ví đầu tiên.
- Tạo ví → Dashboard hiện đúng số dư.
- Tạo ví thứ hai → đổi ví mặc định.
- Ẩn ví mặc định → bắt chọn ví thay thế.
- Mở Danh mục → có 7 Thu + 13 Chi mặc định.
- Tạo/sửa/ẩn danh mục tùy chỉnh.
- Reload trang → dữ liệu không mất.
- Test mobile và desktop.
