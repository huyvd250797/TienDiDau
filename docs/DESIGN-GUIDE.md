# TienDiDau Design Guide — Phase 1

## Hướng thiết kế

Giao diện mobile-first dựa trên ảnh `ui-reference-mobile.png`:

- Nền xanh đen, card phân tầng rõ.
- Primary tím cho điều hướng và hành động chính.
- Thu nhập xanh lá, chi tiêu đỏ, số dư xanh dương.
- Bottom navigation có nút thêm giao dịch nổi ở giữa.
- Card bo góc vừa phải, khoảng cách gọn và số tiền dễ đọc.
- Desktop dùng sidebar; mobile dùng bottom navigation.

## Token chính

| Token | Dark | Light |
|---|---|---|
| Background | `#07101d` | `#f4f6fb` |
| Card | `#111c2b` | `#ffffff` |
| Primary | `#8b65ff` | `#7657f6` |
| Income | `#23c875` | `#17b86a` |
| Expense | `#ff5964` | `#ef4c57` |
| Balance | `#3da5ff` | `#3197ff` |

Nguồn token thực tế nằm trong `src/app/globals.css`.

## Breakpoint

- Mobile: dưới `768px`.
- Tablet: từ `768px`.
- Desktop: từ `1024px`.
- Wide: từ `1440px`.

## Accessibility

- Focus ring rõ cho bàn phím.
- Tôn trọng `prefers-reduced-motion`.
- Kích thước nút tương tác tối thiểu khoảng 42–44px.
- Hỗ trợ safe area cho iPhone.
