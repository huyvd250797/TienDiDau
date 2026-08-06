# Deploy TienDiDau V1.1.3 lên Netlify

Bản này chuyển hoàn toàn bước cài dependency của Netlify từ npm sang **Yarn Classic 1.22.22**. Mục tiêu là tránh lỗi nội bộ của npm Arborist khi npm đọc dependency Git `closure-net` thuộc Firebase Firestore.

## 1. Thay source trên GitHub

Sao chép toàn bộ nội dung bản V1.1.3 vào repository, bao gồm các file ẩn:

- `.nvmrc`
- `.yarnrc`
- `netlify.toml`
- `.github/workflows/quality.yml`

Không giữ các file khóa của package manager khác:

```bash
rm -f package-lock.json npm-shrinkwrap.json pnpm-lock.yaml
```

Commit và push:

```bash
git add -A
git commit -m "fix: deploy Netlify with Yarn"
git push origin main
```

## 2. Kiểm tra Netlify

Trong **Project configuration → Build & deploy → Build settings**:

```text
Build command: yarn build
Publish directory: để trống
Base directory: để trống nếu package.json nằm ở thư mục gốc
```

Trong **Environment variables**, xóa các biến cũ nếu đang tồn tại:

```text
NPM_VERSION
NPM_FLAGS
```

Các giá trị bắt buộc đã được khai báo trong `netlify.toml`:

```text
NODE_VERSION=22.16.0
NETLIFY_USE_YARN=true
```

## 3. Deploy sạch

Vào:

```text
Deploys → Trigger deploy → Clear cache and deploy site
```

Log đúng phải có bước cài bằng Yarn, ví dụ:

```text
Installing Yarn
yarn install
```

Log không được còn dòng:

```text
Installing npm packages
npm error Cannot read properties of null (reading 'matches')
```

## 4. Firebase trên Netlify

Thêm các biến client:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Thêm các biến Firebase Admin dùng cho API server:

```text
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

Với private key, giữ chuỗi xuống dòng ở dạng `\n` trong Netlify.
