// Load cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        displayEmptyCart();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    // Group items by stall
    const itemsByStall = {};
    cart.forEach((item, index) => {
        if (!itemsByStall[item.stallName]) {
            itemsByStall[item.stallName] = [];
        }
        itemsByStall[item.stallName].push({...item, cartIndex: index});
    });
    
    // Display items grouped by stall
    Object.keys(itemsByStall).forEach(stallName => {
        // Create stall section
        const stallSection = document.createElement('div');
        stallSection.className = 'stall-section';
        
        // Stall header
        const stallHeader = document.createElement('div');
        stallHeader.className = 'stall-header';
        stallHeader.innerHTML = `
            <h3>${stallName}</h3>
            <span class="hawker-centre">${itemsByStall[stallName][0].hawkerCentre}</span>
        `;
        stallSection.appendChild(stallHeader);
        
        // Items from this stall
        itemsByStall[stallName].forEach(item => {
            const itemCard = createCartItemCard(item);
            stallSection.appendChild(itemCard);
        });
        
        cartItemsContainer.appendChild(stallSection);
    });
    
    updateOrderSummary();
}

function createCartItemCard(item) {
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item-card';
    
    const itemTotal = item.price * item.quantity;
    
    itemCard.innerHTML = `
        <div class="item-details">
            <h4>${item.name}</h4>
            <p class="item-price">$${item.price.toFixed(2)} each</p>
        </div>
        
        <div class="item-actions">
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${item.cartIndex})" class="qty-btn">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="increaseQuantity(${item.cartIndex})" class="qty-btn">+</button>
            </div>
            
            <div class="item-total">
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
            
            <button onclick="removeFromCart(${item.cartIndex})" class="remove-btn">🗑️</button>
        </div>
    `;
    
    return itemCard;
}

function increaseQuantity(cartIndex) {
    let cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    cart[cartIndex].quantity++;
    localStorage.setItem('hawkerCart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function decreaseQuantity(cartIndex) {
    let cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    if (cart[cartIndex].quantity > 1) {
        cart[cartIndex].quantity--;
        localStorage.setItem('hawkerCart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

function removeFromCart(cartIndex) {
    let cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    cart.splice(cartIndex, 1);
    localStorage.setItem('hawkerCart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const deliveryFee = 5.00;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const total = subtotal + deliveryFee + serviceFee;
    
    document.getElementById('subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('service-fee').textContent = `$${serviceFee.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;

    
    // Save totals for checkout pages
    localStorage.setItem('orderTotals', JSON.stringify({
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        serviceFee: serviceFee,
        total: total
    }));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function displayEmptyCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious food to get started!</p>
            <button onclick="continueShopping()" class="start-shopping-btn" >Start Shopping</button>
        </div>
    `;
    
    // Hide checkout button
    document.querySelector('.checkout-btn').style.display = 'none';
    
    // Reset summary
    document.getElementById('subtotal-amount').textContent = '$0.00';
    document.getElementById('delivery-fee').textContent = '$0.00';
    document.getElementById('service-fee').textContent = '$0.00';
    document.getElementById('total-amount').textContent = '$0.00';
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = '../Payment Method/PaymentMethod.html';
}

function continueShopping() {
    window.location.href = '../../Main-Page/MainPage.html';
}