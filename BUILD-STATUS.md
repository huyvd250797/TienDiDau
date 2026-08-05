# Build Status — V1.1.2 YarnNetlifyFix

## Đã kiểm tra trong gói source

- `package.json` hợp lệ và package manager là Yarn 1.22.22.
- `netlify.toml` dùng Node.js 22.16.0 và ép Netlify cài dependency bằng Yarn.
- Không còn `package-lock.json`, `npm-shrinkwrap.json`, `pnpm-lock.yaml` hoặc `.npmrc`.
- GitHub Actions đã đồng bộ sang Yarn.
- Version UI và Health API đã lên 1.1.2.

## Lệnh kiểm tra local

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install
yarn typecheck
yarn lint
yarn test
yarn build
```

Môi trường đóng gói hiện tại không truy cập được npm registry công khai, vì vậy chưa thể chạy `yarn install` và production build đầy đủ tại đây. Netlify/GitHub Actions sẽ thực hiện kiểm tra dependency và build thực tế sau khi push.
