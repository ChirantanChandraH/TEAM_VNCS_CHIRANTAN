// Global Variables
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    initializeFilters();
});

// Category Management
function showCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Scroll to featured section
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

// Cart Functions
function addToCart(id, price, name) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddToCartFeedback(name);
}

function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        updateCartModal();
    }
}

function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            updateCartModal();
        }
    }
}

function updateCartDisplay() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = cartCount;
}

function showAddToCartFeedback(itemName) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #8b7355;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = `${itemName} added to cart!`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cart Modal Functions
function showCart() {
    updateCartModal();
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color: #666;">₹${item.price.toLocaleString('en-IN')} each</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                            style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
                    <span style="min-width: 20px; text-align: center;">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                            style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
                    <button onclick="removeFromCart('${item.id}')" 
                            style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    cartTotalElement.textContent = cartTotal.toLocaleString('en-IN');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Thank you for your order! Total: ₹${cartTotal.toLocaleString('en-IN')}\n\nThis is a demo - no actual payment will be processed.`);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    closeCart();
}

// Product Filtering
function initializeFilters() {
    // This can be expanded for more complex filtering
    showCategory('all');
}

function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter products
    products.forEach(product => {
        switch(filter) {
            case 'all':
                product.style.display = 'block';
                break;
            case 'new':
                product.style.display = product.querySelector('.product-badge:not(.sale)') ? 'block' : 'none';
                break;
            case 'sale':
                product.style.display = product.querySelector('.product-badge.sale') ? 'block' : 'none';
                break;
            default:
                product.style.display = 'block';
        }
    });
}

// Search functionality
function searchProducts(searchTerm) {
    const products = document.querySelectorAll('.product-card');
    const term = searchTerm.toLowerCase().trim();
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productCategory = product.dataset.category.toLowerCase();
        
        if (term === '' || productName.includes(term) || productCategory.includes(term)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Event listeners for search
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchProducts(e.target.value);
        });
    }
}

// Price range filtering
function filterByPriceRange(minPrice, maxPrice) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const priceElement = product.querySelector('.product-price');
        if (priceElement) {
            const price = parseInt(priceElement.textContent.replace(/[₹,]/g, ''));
            
            if (price >= minPrice && price <= maxPrice) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    });
}

// Utility function to clear all filters
function clearAllFilters() {
    const products = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    
    // Show all products
    products.forEach(product => {
        product.style.display = 'block';
    });
    
    // Reset filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[onclick*="all"]')?.classList.add('active');
    
    // Clear search input
    if (searchInput) {
        searchInput.value = '';
    }
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    
    // Close cart modal when clicking outside
    document.getElementById('cart-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCart();
        }
    });
    
    // Handle escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
});
