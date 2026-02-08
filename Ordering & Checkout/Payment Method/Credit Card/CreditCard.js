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

// Card Form Handler
document.getElementById('cardForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderTotals = JSON.parse(localStorage.getItem('orderTotals'));
    
    const formData = {
        cardName: document.getElementById('cardName').value,
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        email: document.getElementById('email').value,
        billingAddress: document.getElementById('billingAddress').value,
        paymentMethod: 'Credit/Debit Card',
        amount: orderTotals ? orderTotals.total : 0
    };
    
    // Validate card number (simple Luhn algorithm check)
    if (!validateCardNumber(formData.cardNumber)) {
        alert('Invalid card number. Please check and try again.');
        return;
    }
    
    // Validate expiry date
    if (!validateExpiryDate(formData.expiryDate)) {
        alert('Invalid or expired card. Please check the expiry date.');
        return;
    }
    
    console.log('Card Payment Data:', formData);
    
    // Store email for success page
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('paymentMethod', 'Credit/Debit Card');

    // Show processing message
    alert('Processing your payment...');
    
    // Simulate payment processing
    setTimeout(() => {
        alert('Payment successful!\n\nThank you for your purchase.');
        // Redirect to success page
        window.location.href = '../../PaymentSucessful/Success.html?method=Credit/Debit Card';
    }, 1500);
});

// Card number formatting (add spaces every 4 digits)
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Expiry date formatting (MM/YY)
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// CVV - only numbers
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Simple Luhn algorithm for card validation
function validateCardNumber(cardNumber) {
    if (!/^\d{13,19}$/.test(cardNumber)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Validate expiry date
function validateExpiryDate(expiryDate) {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    return expiry > now && parseInt(month) >= 1 && parseInt(month) <= 12;
}