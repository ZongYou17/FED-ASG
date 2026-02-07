// Initialize quantities for each item
let quantities = {
    'zzp-001': 1,
    'zzp-002': 1,
    'zzp-003': 1,
    'zzp-004': 1,
    'zzp-005': 1,
    'zzp-006': 1,
    'zzp-007': 1,
    'zzp-008': 1,
    'zzp-009': 1,
    'zzp-010': 1
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
            stallName: 'Zhen Zhen Porridge',
            hawkerCentre: 'Telok Blangah Drive Food Centre'
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