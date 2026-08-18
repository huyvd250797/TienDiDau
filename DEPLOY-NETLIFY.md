# Deploy TienDiDau V1.2.0 — GitHub → Netlify

## 1. Thay source
Dùng toàn bộ nội dung trong:

```text
TienDiDau-V1.2.0-TransactionsCore.zip
```

thay source V1.1.0 hiện tại. `package.json` phải nằm ở root repository.

## 2. Push GitHub

```bash
git add -A
git commit -m "Release TienDiDau V1.2.0 Transactions Core"
git push origin main
```

Netlify sẽ tự build.

## 3. Nếu Netlify dùng cache cũ

```text
Deploys
→ Trigger deploy
→ Clear cache and deploy site
```

Build chuẩn:

```text
npm run build
publish: out
```

## 4. Publish Firestore Rules — BẮT BUỘC
Sau khi source deploy:

```text
Firebase Console
→ Firestore Database
→ Rules
→ copy toàn bộ firestore.rules của V1.2.0
→ Publish
```

Nếu không publish rules mới, thao tác lưu transaction sẽ bị `permission-denied`.

## 5. Smoke test production
1. Mở app.
2. Kiểm tra ví/danh mục V1.1.0 vẫn còn.
3. Tạo Thu +100.000 → ví tăng đúng 100.000.
4. Tạo Chi 30.000 → ví giảm đúng 30.000.
5. Tạo ví thứ hai; chuyển 20.000 → tổng tài sản không đổi.
6. Sửa Chi 30.000 → 50.000 → ví chỉ giảm thêm 20.000.
7. Xóa giao dịch Chi → số dư hoàn tác đúng.
8. Tạo danh mục mới → nhập Emoji tùy chỉnh từ bàn phím điện thoại → lưu và dùng được trong giao dịch.
9. Reload site → dữ liệu vẫn đúng.
