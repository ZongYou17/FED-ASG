// Firebase Configuration
const FIREBASE_CONFIG = {
    databaseURL: 'https://hawker-hub-app-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Load order totals when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadOrderTotals();
});

// Load order totals from localStorage
function loadOrderTotals() {
    const orderTotals = JSON.parse(localStorage.getItem('orderTotals'));
    
    if (orderTotals) {
        document.getElementById('subtotal').textContent = `$${orderTotals.subtotal.toFixed(2)}`;
        document.getElementById('deliveryFee').textContent = `$${orderTotals.deliveryFee.toFixed(2)}`;
        document.getElementById('serviceFee').textContent = `$${orderTotals.serviceFee.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${orderTotals.total.toFixed(2)}`;
    } else {
        // If no totals found, redirect back to cart
        alert('No order found. Please add items to your cart first.');
        window.location.href = '../../Cart/Cart.html';
    }
}

// Apple Pay Form Handler
document.getElementById('applePayForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderTotals = JSON.parse(localStorage.getItem('orderTotals'));
    
    const formData = {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        paymentMethod: 'Apple Pay',
        amount: orderTotals ? orderTotals.total : 0
    };

    // Store email for success page
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('paymentMethod', 'Apple Pay');
    
    // Simulate Apple Pay authentication
    console.log('Apple Pay Data:', formData);
    
    // Show processing message
    alert('Redirecting to Apple Pay authentication...\n\nPlease use Touch ID or Face ID to complete the payment.');
    
    // In a real application, this would integrate with Apple Pay API
    setTimeout(() => {
        // Redirect to success page
        window.location.href = '../../PaymentSucessful/Success.html?method=Apple Pay';
    }, 1500);
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    e.target.value = value;
});