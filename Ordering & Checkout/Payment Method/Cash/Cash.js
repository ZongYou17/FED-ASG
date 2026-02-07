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
        document.getElementById('exactAmount').textContent = `$${orderTotals.total.toFixed(2)}`;
    } else {
        // If no totals found, redirect back to cart
        alert('No order found. Please add items to your cart first.');
        window.location.href = '../../Cart/Cart.html';
    }
}

// Cash Payment Form Handler
document.getElementById('cashForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderTotals = JSON.parse(localStorage.getItem('orderTotals'));
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        notes: document.getElementById('notes').value,
        paymentMethod: 'Cash on Delivery',
        amount: orderTotals ? orderTotals.total : 0
    };

    // Store email for success page
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('paymentMethod', 'Cash on Delivery');
    
    console.log('Cash Payment Data:', formData);
    
    // Show confirmation message
    alert(`Order confirmed!\n\nYour order will be delivered to:\n${formData.address}\n\nPlease prepare exact amount: $${orderTotals.total.toFixed(2)}\n\nYou will receive a confirmation email shortly.`);
    
    // Simulate order processing
    setTimeout(() => {
        alert('Confirmation email sent!\n\nEstimated delivery: 2-3 business days\n\nThank you for your order!');
        // Redirect to success page
        window.location.href = '../../PaymentSucessful/Success.html?method=Cash on Delivery';
    }, 1000);
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    e.target.value = value;
});