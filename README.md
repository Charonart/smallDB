# Clothing Ecommerce Website

Một trang web thương mại điện tử hiện đại được xây dựng bằng HTML, CSS và JavaScript thuần, với thiết kế tối giản và thanh lịch.

## Tính năng chính

### Trang người dùng
- **Trang chủ**: Hiển thị sản phẩm nổi bật, laptop và điện thoại
- **Trang sản phẩm**: Danh sách tất cả sản phẩm với tìm kiếm và sắp xếp
- **Chi tiết sản phẩm**: Thông tin chi tiết, đánh giá và thêm vào giỏ hàng
- **Giỏ hàng**: Quản lý sản phẩm, cập nhật số lượng và thanh toán
- **Đăng nhập/Đăng ký**: Xác thực người dùng với phân quyền admin

### Trang quản trị
- **Quản lý sản phẩm**: CRUD đầy đủ cho sản phẩm
- **Bảo mật**: Chỉ admin mới có thể truy cập
- **Giao diện thân thiện**: Modal forms và bảng dữ liệu

## Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: MyJSON Server (JSON Server)
- **Icons**: Font Awesome 6.4.0
- **Storage**: LocalStorage cho giỏ hàng và người dùng

## Cấu trúc dự án

```
├── index.html              # Trang chủ
├── products.html           # Trang sản phẩm
├── product-detail.html     # Chi tiết sản phẩm
├── cart.html              # Giỏ hàng
├── login.html             # Đăng nhập/Đăng ký
├── css/
│   └── style.css          # Stylesheet chính
├── js/
│   ├── main.js            # Logic frontend
│   └── admin.js           # Logic admin
└── admin/
    └── index.html         # Trang quản trị
```

## Cài đặt và chạy

1. **Clone hoặc tải dự án**
   ```bash
   git clone [repository-url]
   cd clothing-ecommerce
   ```

2. **Mở trang web**
   - Mở file `index.html` trong trình duyệt web
   - Hoặc sử dụng Live Server extension trong VS Code

3. **Truy cập admin**
   - Đăng nhập với tài khoản admin:
     - Email: `admin@example.com`
     - Password: `admin123`

## API Backend

Dự án sử dụng MyJSON Server để lưu trữ dữ liệu:
- **Products**: `https://my-json-server.typicode.com/Charonart/backend-FPL-DB/products`
- **Users**: `https://my-json-server.typicode.com/Charonart/backend-FPL-DB/users`

## Tính năng chi tiết

### Class Product
```javascript
class Product {
    constructor(id, name, price, image, category, hot, description, rating, reviews)
    render()           // Hiển thị card sản phẩm
    renderDetail()     // Hiển thị chi tiết sản phẩm
    renderReviews()    // Hiển thị đánh giá
}
```

### Class Cart
```javascript
class Cart {
    constructor()                    // Khởi tạo từ localStorage
    addItem(product)                // Thêm sản phẩm
    removeItem(productId)           // Xóa sản phẩm
    updateQuantity(productId, qty)  // Cập nhật số lượng
    getTotal()                      // Tính tổng tiền
    render()                        // Hiển thị giỏ hàng
}
```

### Tính năng tìm kiếm và lọc
- Tìm kiếm theo tên sản phẩm
- Sắp xếp theo giá (tăng/giảm dần)
- Lọc theo danh mục

### Responsive Design
- Thiết kế responsive cho mobile, tablet và desktop
- Grid layout linh hoạt
- Navigation menu thích ứng

## Màu sắc và thiết kế

- **Primary Brown**: #8B4513
- **Light Brown**: #D2B48C  
- **Cream**: #F5F5DC
- **Dark Brown**: #654321
- **Beige**: #F0E68C

Thiết kế tối giản với focus vào trải nghiệm người dùng và hiệu suất.

## Hướng dẫn sử dụng

1. **Duyệt sản phẩm**: Truy cập trang chủ để xem sản phẩm nổi bật
2. **Tìm kiếm**: Sử dụng trang sản phẩm để tìm kiếm và lọc
3. **Xem chi tiết**: Click vào sản phẩm để xem thông tin chi tiết
4. **Thêm vào giỏ**: Sử dụng nút "Thêm vào giỏ hàng"
5. **Thanh toán**: Truy cập giỏ hàng để hoàn tất đơn hàng
6. **Quản trị**: Đăng nhập admin để quản lý sản phẩm

## Lưu ý

- Dữ liệu giỏ hàng được lưu trong localStorage
- Đơn hàng được lưu trong localStorage (có thể mở rộng để gửi lên server)
- Admin có thể thêm/sửa/xóa sản phẩm thông qua giao diện web
- Website hoạt động offline sau khi tải lần đầu

## Phát triển thêm

- Tích hợp thanh toán thực tế
- Quản lý đơn hàng trong admin
- Hệ thống đánh giá sản phẩm
- Tối ưu SEO
- PWA (Progressive Web App)
