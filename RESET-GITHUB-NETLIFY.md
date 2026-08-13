# Reset repository sang bản Lite

## GitHub

Xóa source cũ trong repository nhưng giữ repository và lịch sử Git nếu muốn. Sau đó copy **nội dung bên trong** thư mục `TienDiDau-Lite-V1.0.0` vào root repository.

Cấu trúc đúng:

```text
TienDiDau/
  package.json
  netlify.toml
  firestore.rules
  src/
```

Không để thành:

```text
TienDiDau/
  TienDiDau-Lite-V1.0.0/
    package.json
```

Commit gợi ý:

```text
Reset TienDiDau to Lite V1.0.0
```

## Firebase

- Bật Anonymous Authentication.
- Publish rules mới trong `firestore.rules`.
- Không cần Firebase Admin/Service Account cho bản này.

## Netlify

- Project visibility: Public.
- Build command đọc từ `netlify.toml`: `npm run build`.
- Publish directory: `out`.
- Giữ 6 `NEXT_PUBLIC_FIREBASE_*`.
- Xóa 3 `FIREBASE_ADMIN_*`.
- Trigger deploy -> Clear cache and deploy site.
