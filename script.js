// To handle mobile menu toggle button
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
    // To toggle the navigation menu open/close
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// To close mobile menu when a nav link is clicked
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// To add scroll effect to header (e.g., shadow or background change)
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// To store product details in an array
const products = [
    { id: 1, name: "Essential Black Tee", price: 49.99, category: "clothing", image: "images/t shirt.jpg", featured: true },
    { id: 2, name: "Minimalist Hoodie", price: 89.99, category: "clothing", image: "images/hoodie.jpg", featured: true },
    { id: 3, name: "Signature Cap", price: 39.99, category: "accessories", image: "images/cap.jpeg", featured: true },
    { id: 4, name: "Classic Sweatpants", price: 69.99, category: "clothing", image: "images/pant.jpeg", featured: false },
    { id: 5, name: "Leather Wallet", price: 59.99, category: "accessories", image: "images/walllet.jpeg", featured: false },
    { id: 6, name: "Oversized T-Shirt", price: 54.99, category: "clothing", image: "images/baggy.jpeg", featured: false }
];

// To display featured products on homepage
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        const featuredProducts = products.filter(product => product.featured);
        featuredProducts.forEach(product => {
            featuredContainer.innerHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
        });
    }
}

// To display all products on the shop page with filtering/sorting
function displayAllProducts() {
    const productsContainer = document.getElementById('all-products');
    if (productsContainer) {
        products.forEach(product => {
            productsContainer.innerHTML += `
                <div class="product-card" data-category="${product.category}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
        });

        // To filter products by category
        const categoryFilter = document.getElementById('category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const selectedCategory = this.value;
                const productCards = document.querySelectorAll('.product-card');
                productCards.forEach(card => {
                    card.style.display = (selectedCategory === 'all' || card.dataset.category === selectedCategory) ? 'block' : 'none';
                });
            });
        }

        // To sort products by price (low to high or high to low)
        const sortFilter = document.getElementById('sort');
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                const productCards = Array.from(document.querySelectorAll('.product-card'));
                productCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                    return this.value === 'price-low' ? priceA - priceB : priceB - priceA;
                });
                productCards.forEach(card => productsContainer.appendChild(card));
            });
        }
    }
}

// To initialize or retrieve the shopping cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// To update the quantity of an item in the cart
function updateQuantity(productId, quantity) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity = parseInt(quantity) || 1;
        if (item.quantity < 1) item.quantity = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// To remove an item from the cart
function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// To calculate the total cost of items in the cart
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// To update the cart icon with the current total quantity
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountEl.textContent = count;
    }
}

// To add an item to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} added to cart!`);
    }
}

// To handle click events for "Add to Cart" buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        addToCart(productId);
    }
});

// To display the cart page items and manage interactions
function renderCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-page');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMsg = document.querySelector('.empty-cart-message');

    if (cartItemsContainer) {
        // To remove existing cart items before re-rendering
        document.querySelectorAll('.cart-item').forEach(item => item.remove());

        // To display empty cart message and zero totals
        if (cart.length === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'block';
            if (cartSubtotal) cartSubtotal.textContent = '$0.00';
            if (cartShipping) cartShipping.textContent = '$0.00';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }

        if (emptyCartMsg) emptyCartMsg.style.display = 'none';

        // To render each item in the cart
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">−</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <span class="remove-item" data-id="${item.id}">Remove</span>
                </div>
            `;
            cartItemsContainer.insertBefore(cartItem, emptyCartMsg);
        });

        // To calculate and display subtotal, shipping, and total
        const subtotal = calculateTotal();
        const shipping = subtotal > 0 ? 5.00 : 0.00;
        const total = subtotal + shipping;

        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartShipping) cartShipping.textContent = `$${shipping.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

        // To handle decreasing quantity
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const item = cart.find(item => item.id === id);
                if (item.quantity > 1) {
                    updateQuantity(id, item.quantity - 1);
                    renderCartPage();
                }
            });
        });

        // To handle increasing quantity
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(id, cart.find(item => item.id === id).quantity + 1);
                renderCartPage();
            });
        });

        // To manually update quantity via input
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(id, e.target.value);
                renderCartPage();
            });
        });

        // To handle item removal from cart
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(id);
                renderCartPage();
            });
        });

        // To handle checkout button click
        const checkoutBtn = document.getElementById('proceed-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }
                alert('Redirecting to checkout...');
                // window.location.href = 'checkout.html';
            });
        }
    }
}

// To handle contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        console.log('Form submitted:', { name, email, subject, message });
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// To initialize the page content once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    displayAllProducts();
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
});
