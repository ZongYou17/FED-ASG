// Initialize quantities for each item
let quantities = {
    'tt-001': 1,
    'tt-002': 1,
    'tt-003': 1,
    'tt-004': 1,
    'tt-005': 1,
    'tt-006': 1,
    'tt-007': 1,
    'tt-008': 1,
    'tt-009': 1,
    'tt-010': 1,
    'tt-011': 1,
    'tt-012': 1
};

// Load page content
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Increase quantity
function increaseQuantity(itemId) {
    quantities[itemId]++;
    document.getElementById(`qty-${itemId}`).textContent = quantities[itemId];
}

// Decrease quantity
function decreaseQuantity(itemId) {
    if (quantities[itemId] > 1) {
        quantities[itemId]--;
        document.getElementById(`qty-${itemId}`).textContent = quantities[itemId];
    }
}

// Add to cart
function addToCart(itemId, itemName, itemPrice) {
    const quantity = quantities[itemId];
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            stallName: 'Tian Tian Chicken Rice',
            hawkerCentre: 'Maxwell Food Centre'
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('hawkerCart', JSON.stringify(cart));
    
    // Reset quantity to 1
    quantities[itemId] = 1;
    document.getElementById(`qty-${itemId}`).textContent = 1;
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showCartNotification();
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Show cart notification
function showCartNotification() {
    const notification = document.getElementById('cart-notification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// View cart
function viewCart() {
    window.location.href = '../Cart-Page/cart.html';
}

// Go back to stall selection
function goBack() {
    const urlParams = new URLSearchParams(window.location.search);
    const centreName = urlParams.get('centre');
    window.location.href = '../SelectHawkerCentrePage/Maxwell-SelectStall.html?centre=' + encodeURIComponent(centreName);
}
// Show cart page
function showCart() {
    window.location.href = '../Cart/cart.html';
}