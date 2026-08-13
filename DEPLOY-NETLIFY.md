# Deploy TienDiDau V1.1.3 lên Netlify

## 1. Firebase

Bật Anonymous Authentication:

```text
Firebase Console → Authentication → Sign-in method → Anonymous → Enable
```

Tạo Firestore database nếu chưa có và publish `firestore.rules` của source này.

## 2. Netlify Environment Variables

Giữ đúng 6 biến:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Có thể xóa:

```text
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

V1.1.3 không dùng Firebase Admin hoặc service-account.

## 3. GitHub

Push toàn bộ source lên nhánh `main`. `package.json` phải ở thư mục gốc repository.

## 4. Netlify build

`netlify.toml` đã cấu hình:

```text
Build command: npm run build
Publish directory: out
Node: 24
```

Netlify chỉ host file tĩnh; không tạo Next.js Server Function cho app này.

## 5. Sau deploy

Mở production URL. App phải đi thẳng vào Dashboard sau một loading ngắn, không có Google Login.

Nếu hiện lỗi `Firebase Anonymous chưa được bật`, bật provider Anonymous trong Firebase.

Nếu hiện `Firestore Rules chưa cho phép`, publish lại file `firestore.rules`.
