# Tiền Đi Đâu — V1.0.0 Foundation

Source code **Giai đoạn 1 — Khởi tạo nền tảng** của ứng dụng quản lý thu chi Tiền Đi Đâu.

## Đã hoàn thành

- Next.js App Router + React + TypeScript Strict Mode.
- Tailwind CSS 4 theo cấu hình CSS-first.
- ESLint Flat Config, Prettier và alias `@/*`.
- Design system bằng CSS variables, hỗ trợ Dark / Light / System.
- Dark Mode mặc định theo thiết kế Boss đã duyệt.
- App Shell responsive cho Desktop, Tablet và Mobile.
- Sidebar desktop, topbar và bottom navigation trên mobile.
- Dashboard mẫu để kiểm tra giao diện và breakpoint.
- Ảnh giao diện tham khảo tại `docs/ui-reference-mobile.png`.
- Firebase Web SDK: Auth, Firestore, Storage và offline cache.
- Firebase Admin SDK chạy Node.js, hỗ trợ service account hoặc ADC.
- Firebase Emulator, Firestore Rules và Storage Rules khởi đầu.
- `.env.example`, health API và cấu hình Firebase App Hosting.

> Phase này chỉ xây nền tảng. Đăng nhập, CRUD ví/danh mục/giao dịch và dữ liệu thật sẽ được phát triển ở các phase sau.

## Yêu cầu môi trường

- Node.js 22 trở lên. Khuyến nghị dùng Node.js LTS.
- pnpm 10.
- Firebase project nếu cần kết nối dữ liệu thật.

## Chạy dự án

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Mở `http://localhost:3000`.

API kiểm tra nền tảng:

```text
GET http://localhost:3000/api/health
```

## Cấu hình Firebase

1. Tạo Firebase project.
2. Tạo Web App trong Firebase Console.
3. Bật Authentication, Firestore và Storage.
4. Sao chép `.env.example` thành `.env.local`.
5. Điền các biến `NEXT_PUBLIC_FIREBASE_*`.
6. Với backend local, điền `FIREBASE_ADMIN_*` hoặc dùng `GOOGLE_APPLICATION_CREDENTIALS`.

Không commit `.env.local`, private key hoặc file service account vào Git.

## Firebase Emulator

Cài Firebase CLI, sau đó:

```bash
firebase emulators:start
```

Trong `.env.local`:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Kiểm tra chất lượng

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

## Cấu trúc chính

```text
src/
├── app/                 # Next.js App Router
├── components/
│   ├── dashboard/       # UI Dashboard mẫu
│   ├── layout/          # Responsive App Shell
│   ├── providers/       # Theme Provider
│   └── ui/              # UI primitives
├── lib/
│   ├── firebase/        # Firebase client/admin/config
│   ├── design-tokens.ts
│   └── navigation.ts
└── types/
```

## Theme và design tokens

- CSS tokens: `src/app/globals.css`.
- TypeScript tokens: `src/lib/design-tokens.ts`.
- Theme state: `src/components/providers/theme-provider.tsx`.
- Mặc định là Dark Mode; người dùng có thể đổi theme trên header.

## Lưu ý dependency lock

Môi trường tạo source không truy cập được npm registry nên chưa thể chạy `pnpm install` để sinh `pnpm-lock.yaml`. Sau lần cài đầu tiên, pnpm sẽ tạo lockfile; nên commit file đó để khóa dependency chính xác.
