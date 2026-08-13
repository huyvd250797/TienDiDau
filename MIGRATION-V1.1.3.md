# Migration V1.1.2 → V1.1.3 Direct Access

## Mục tiêu

Giảm độ phức tạp và thời gian deploy/chạy app: bỏ Google Login bắt buộc, Firebase Admin và Netlify Functions.

## Trước khi push source

Trong Firebase Console:

1. Authentication → Sign-in method.
2. Bật **Anonymous**.
3. Firestore → Rules → publish `firestore.rules` của V1.1.3.

## Netlify

Giữ 6 biến `NEXT_PUBLIC_FIREBASE_*` hiện có.

Xóa 3 biến không còn dùng:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

Nếu Google provider đang bật có thể để nguyên; app không gọi Google Login.

## Push GitHub

Ghi đè source rồi commit:

```bash
git add .
git commit -m "Simplify direct access V1.1.3"
git push origin main
```

Netlify sẽ build static output `out/`.

## Dữ liệu cũ

Nếu trình duyệt vẫn còn phiên Firebase Google của V1.1.2, V1.1.3 tiếp tục dùng cùng UID và workspace cũ; không bắt đăng nhập lại.

Nếu mở bằng trình duyệt/thiết bị mới, app tự tạo Anonymous UID và bộ dữ liệu cá nhân mới.
