// Firebase Configuration
const FIREBASE_CONFIG = {
    databaseURL: 'https://hawker-hub-app-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Load order totals when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadOrderTotals();
    // In a real application, this would generate an actual QR code
    // using a library like qrcode.js
    console.log('QR Code generated for PayNow payment');
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

// PayNow Form Handler
document.getElementById('payNowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderTotals = JSON.parse(localStorage.getItem('orderTotals'));
    
    const formData = {
        payNowId: document.getElementById('payNowId').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        paymentMethod: 'PayNow',
        amount: orderTotals ? orderTotals.total : 0
    };

    // Store email for success page
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('paymentMethod', 'PayNow');
    
    console.log('PayNow Data:', formData);
    
    // Show processing message
    alert('Processing PayNow payment...\n\nPlease complete the payment on your banking app.');
    
    // Simulate payment processing
    setTimeout(() => {
        alert('PayNow payment initiated!\n\nPlease check your banking app to complete the transaction.\n\nYou will receive a confirmation email once payment is verified.');
        // Redirect to success page
        window.location.href = '../../PaymentSucessful/Success.html?method=PayNow';
    }, 1500);
});