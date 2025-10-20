// Product Class
class Product {
    constructor(id, name, price, image, category, hot, description, rating, reviews) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.hot = hot;
        this.description = description;
        this.rating = rating;
        this.reviews = reviews;
    }

    render() {
        return `
            <div class="product-card">
                <img src="${this.image}" alt="${this.name}" class="product-image">
                <div class="product-info">
                    <a href="product-detail.html?id=${this.id}" class="product-name">${this.name}</a>
                    <div class="product-price">${this.price.toLocaleString('vi-VN')} đ</div>
                    <span class="product-category">${this.category}</span>
                </div>
            </div>
        `;
    }

    renderDetail() {
        return `
            <div class="product-detail">
                <img src="${this.image}" alt="${this.name}" class="product-detail-image">
                <div class="product-detail-info">
                    <h1>${this.name}</h1>
                    <div class="product-detail-price">${this.price.toLocaleString('vi-VN')} đ</div>
                    <span class="product-detail-category">${this.category}</span>
                    <p class="product-description">${this.description}</p>
                    <button id="addCartBtn" productId="${this.id}" class="add-to-cart-btn">Thêm vào giỏ hàng</button>
                </div>
            </div>
            ${this.renderReviews()}
        `;
    }

    renderReviews() {
        if (!this.reviews || this.reviews.length === 0) {
            return '';
        }

        let reviewsHtml = '<div class="reviews-section"><h3 class="reviews-title">Đánh giá sản phẩm</h3>';
        this.reviews.forEach(review => {
            reviewsHtml += `
                <div class="review-item">
                    <div class="review-user">${review.user}</div>
                    <div class="review-rating">${'★'.repeat(Math.floor(review.rating))}${'☆'.repeat(5 - Math.floor(review.rating))} (${review.rating})</div>
                    <div class="review-comment">${review.comment}</div>
                </div>
            `;
        });
        reviewsHtml += '</div>';
        return reviewsHtml;
    }
}

// Cart Class
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.renderCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(this.items));
                this.updateCartCount();
                this.renderCart();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-container');
        if (cartContainer) {
            cartContainer.innerHTML = this.render();
        }
    }

    render() {
        if (this.items.length === 0) {
            return '<p>Giỏ hàng trống</p>';
        }

        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.items.forEach(item => {
            html += `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
                    <td>${item.name}</td>
                    <td>${item.price.toLocaleString('vi-VN')} đ</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" 
                               class="quantity-input" 
                               onchange="cart.updateQuantity('${item.id}', this.value)">
                    </td>
                    <td>${(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                    <td>
                        <button class="remove-btn" onclick="cart.removeItem('${item.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="cart-total">
                Tổng cộng: ${this.getTotal().toLocaleString('vi-VN')} đ
            </div>
            <button class="checkout-btn" onclick="checkout()">Thanh toán</button>
        `;

        return html;
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }
}

// Global cart instance
const cart = new Cart();

// Helper function to render products
const renderProduct = (array, theDiv) => {
    let html = "";
    array.forEach((item) => {
        const product = new Product(
            item.id,
            item.name,
            item.price,
            item.image,
            item.category,
            item.hot,
            item.description,
            item.rating,
            item.reviews
        );
        html += product.render();
    });
    theDiv.innerHTML = html;
};

// Homepage functionality
const productHot = document.getElementById('product-hot');
const productLaptop = document.getElementById('product-laptop');
const productDienThoai = document.getElementById('product-dienthoai');

if (productHot) {
    fetch('https://my-json-server.typicode.com/Charonart/smallDB/products')
        .then(response => response.json())
        .then(data => {
            const dataHot = data.filter(p => p.hot == true);
            const dataWomen = data.filter(p => p.category === "women");
            const dataMen = data.filter(p => p.category === "men");
            
            renderProduct(dataHot, productHot);
            renderProduct(dataWomen, productLaptop);
            renderProduct(dataMen, productDienThoai);
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Products page functionality
const productAll = document.getElementById('all-product');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortPrice = document.getElementById('sort-price');
const sortRating = document.getElementById('sort-rating');
let allProductsData = [];

if (productAll) {
    fetch('https://my-json-server.typicode.com/Charonart/smallDB/products')
        .then(response => response.json())
        .then(data => {
            renderProduct(data, productAll);
            allProductsData = data;
        })
        .catch(error => console.error('Error fetching products:', error));

    // Function to apply all filters and sorting
    function applyFiltersAndSort() {
        let filteredProducts = [...allProductsData];

        // Apply search filter
        if (searchInput && searchInput.value) {
            const keyword = searchInput.value.toLowerCase();
            filteredProducts = filteredProducts.filter(
                p => p.name.toLowerCase().includes(keyword)
            );
        }

        // Apply category filter
        if (categoryFilter && categoryFilter.value) {
            filteredProducts = filteredProducts.filter(
                p => p.category === categoryFilter.value
            );
        }

        // Apply price sorting
        if (sortPrice && sortPrice.value) {
            if (sortPrice.value === "asc") {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortPrice.value === 'desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
        }

        // Apply rating sorting
        if (sortRating && sortRating.value) {
            if (sortRating.value === "rating-asc") {
                filteredProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
            } else if (sortRating.value === 'rating-desc') {
                filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            }
        }

        renderProduct(filteredProducts, productAll);
    }

    // Add event listeners
    if (searchInput) {
        searchInput.addEventListener('input', applyFiltersAndSort);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFiltersAndSort);
    }

    if (sortPrice) {
        sortPrice.addEventListener('change', applyFiltersAndSort);
    }

    if (sortRating) {
        sortRating.addEventListener('change', applyFiltersAndSort);
    }
}

// Product detail page functionality
const productDetailDiv = document.getElementById('product-detail');
if (productDetailDiv) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        fetch(`https://my-json-server.typicode.com/Charonart/smallDB/products/${id}`)
            .then(response => response.json())
            .then(item => {
                const product = new Product(
                    item.id,
                    item.name,
                    item.price,
                    item.image,
                    item.category,
                    item.hot,
                    item.description,
                    item.rating,
                    item.reviews
                );
                productDetailDiv.innerHTML = product.renderDetail();
            })
            .catch(error => console.error('Error fetching product:', error));
    }
}

// Cart page functionality
const cartContainer = document.getElementById('cart-container');
if (cartContainer) {
    cartContainer.innerHTML = cart.render();
}

// Add to cart event delegation
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'addCartBtn') {
        const productId = e.target.getAttribute('productId');
        fetch(`https://my-json-server.typicode.com/Charonart/smallDB/products/${productId}`)
            .then(response => response.json())
            .then(item => {
                const product = new Product(
                    item.id,
                    item.name,
                    item.price,
                    item.image,
                    item.category,
                    item.hot,
                    item.description,
                    item.rating,
                    item.reviews
                );
                cart.addItem(product);
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            })
            .catch(error => console.error('Error adding to cart:', error));
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Checkout function
function checkout() {
    if (cart.items.length === 0) {
        showNotification('Giỏ hàng trống!', 'info');
        return;
    }
    
    const order = {
        id: Date.now(),
        items: cart.items,
        total: cart.getTotal(),
        date: new Date().toISOString()
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart.items = [];
    localStorage.setItem('cart', JSON.stringify(cart.items));
    cart.updateCartCount();
    
    showNotification('Đặt hàng thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Create header
const header = document.createElement('header');
header.className = 'header';
header.innerHTML = `
    <div class="support-bar">
        <span>Hỗ trợ (406) 555-0120</span>
        <span>Đăng ký và NHẬN 25% GIẢM GIÁ cho đơn hàng đầu tiên. Đăng ký ngay!</span>
        <span class="close-btn">&times;</span>
    </div>
    <div class="header-content">
        <a href="index.html" class="logo">
            <div class="logo-icon">C</div>
            Clothing.
        </a>
        <nav>
            <ul class="nav-menu">
                <li><a href="index.html">Trang chủ</a></li>
                <li><a href="products.html">Sản phẩm</a></li>
                <li><a href="cart.html">Giỏ hàng</a></li>
                <li><a href="about.html">Về chúng tôi</a></li>
                <li><a href="contact.html">Liên hệ</a></li>
            </ul>
        </nav>
        <div class="header-actions">
            <i class="fas fa-search"></i>
            <i class="fas fa-heart"></i>
            <a href="cart.html" style="position: relative; text-decoration: none; color: inherit;">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-count">${cart.items.length}</span>
            </a>
            <a href="login.html"><i class="fas fa-user"></i></a>
        </div>
    </div>
`;

// Create footer
const footer = document.createElement('footer');
footer.className = 'footer';
footer.innerHTML = `
    <div class="footer-content">
        <div class="footer-grid">
            <div class="footer-section">
                <h3>Công ty</h3>
                <ul>
                    <li><a href="about.html">Về chúng tôi</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="contact.html">Liên hệ</a></li>
                    <li><a href="career.html">Tuyển dụng</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Dịch vụ khách hàng</h3>
                <ul>
                    <li><a href="account.html">Tài khoản của tôi</a></li>
                    <li><a href="track.html">Theo dõi đơn hàng</a></li>
                    <li><a href="return.html">Đổi trả</a></li>
                    <li><a href="faq.html">Câu hỏi thường gặp</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Thông tin của chúng tôi</h3>
                <ul>
                    <li><a href="privacy.html">Chính sách bảo mật</a></li>
                    <li><a href="terms.html">Điều khoản sử dụng</a></li>
                    <li><a href="return-policy.html">Chính sách đổi trả</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Thông tin liên hệ</h3>
                <p>Điện thoại: +0123-456-789</p>
                <p>Email: example@gmail.com</p>
                <p>Địa chỉ: 8502 Preston Rd. Inglewood, Maine 98380</p>
                <div class="social-icons">
                    <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>Copyright © 2024 Clothing Website Design. All Rights Reserved.</p>
            <div class="language-currency">
                <span>Tiếng Việt | VND</span>
            </div>
        </div>
    </div>
`;

// Insert header and footer into all pages
document.body.prepend(header);
document.body.appendChild(footer);

// Close support bar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-btn')) {
        e.target.closest('.support-bar').style.display = 'none';
    }
});
