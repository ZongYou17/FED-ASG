// Generate order details on page load
window.addEventListener('DOMContentLoaded', function() {
    // Generate random order number
    const orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').textContent = orderNumber;

    // Get current date and time
    const now = new Date();
    const dateTime = formatDateTime(now);
    document.getElementById('dateTime').textContent = dateTime;

    // Get payment method from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paymentMethod = urlParams.get('method') || localStorage.getItem('paymentMethod') || 'Credit Card';
    document.getElementById('paymentMethod').textContent = paymentMethod;

    // Get email from localStorage if available
    const email = localStorage.getItem('userEmail') || 'customer@example.com';
    document.getElementById('email').textContent = email;

    // Trigger success animation
    setTimeout(() => {
        document.querySelector('.checkmark-circle').classList.add('animate');
    }, 100);

    // Clear stored payment data
    clearPaymentData();
});

// Generate random order number
function generateOrderNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `#ORD-${year}-${randomNum}`;
}

// Format date and time
function formatDateTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
}

// Clear payment data from storage
function clearPaymentData() {
    // Clear sensitive payment information
    localStorage.removeItem('cardNumber');
    localStorage.removeItem('cvv');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('paymentMethod');
    
    // Clear the cart after successful payment
    localStorage.removeItem('hawkerCart');
}

// Download receipt as PDF (simplified version)
function downloadReceipt() {
    alert('Receipt download feature would be implemented here.\n\nIn a real application, this would generate a PDF receipt.');
}