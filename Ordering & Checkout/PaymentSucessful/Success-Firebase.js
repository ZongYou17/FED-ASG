// ===== FIREBASE CONFIGURATION =====
const FIREBASE_CONFIG = {
    databaseURL: 'https://hawker-hub-app-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Generate order details on page load
window.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Success page loaded');
    
    // Generate random order number
    const orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').textContent = orderNumber;

    // Retrieve the saved totals from Cart page
    const orderTotals = JSON.parse(localStorage.getItem('orderTotals'));
    
    if (orderTotals) {
        // Update the HTML to show correct amounts
        const summaryRows = document.querySelectorAll('.success-summary .summary-row');
        summaryRows[0].querySelector('span:last-child').textContent = `$${orderTotals.subtotal.toFixed(2)}`;
        summaryRows[1].querySelector('span:last-child').textContent = `$${orderTotals.serviceFee.toFixed(2)}`;
        
        document.querySelector('.summary-row.total span:last-child').textContent = `$${orderTotals.total.toFixed(2)}`;
    }

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

    // Get cart data before clearing
    const cartData = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    const totalAmount = orderTotals ? orderTotals.total.toFixed(2) : calculateTotalAmount(cartData);

    // ===== FIREBASE API CALL - SAVE ORDER =====
    console.log('💾 Saving order to Firebase...');
    const orderData = {
        orderNumber: orderNumber,
        email: email,
        paymentMethod: paymentMethod,
        totalAmount: parseFloat(totalAmount),
        subtotal: orderTotals ? orderTotals.subtotal : 0,
        deliveryFee: orderTotals ? orderTotals.deliveryFee : 0,
        serviceFee: orderTotals ? orderTotals.serviceFee : 0,
        items: cartData,
        status: 'confirmed',
        createdAt: now.toISOString(),
        hawkerCentre: cartData[0]?.hawkerCentre || 'Unknown',
        stallName: cartData[0]?.stallName || 'Unknown'
    };
    
    const savedOrder = await saveOrderToFirebase(orderData);
    
    if (savedOrder) {
        console.log('✅ Order saved successfully to Firebase!');
        console.log('📋 Order ID:', savedOrder.firebaseId);
    } else {
        console.log('❌ Failed to save order to Firebase');
    }

    // Clear stored payment data and cart
    clearPaymentData();
});

// ===== FIREBASE API FUNCTIONS =====

/**
 * Save order to Firebase Realtime Database using REST API
 * API Method: POST
 * Endpoint: /orders.json
 */
async function saveOrderToFirebase(orderData) {
    try {
        console.log('📡 Making POST request to Firebase API...');
        console.log('🔗 URL:', `${FIREBASE_CONFIG.databaseURL}/orders.json`);
        console.log('📦 Data:', orderData);
        
        const response = await fetch(`${FIREBASE_CONFIG.databaseURL}/orders.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Firebase API Response:', result);
            console.log('🆔 Firebase generated ID:', result.name);
            
            // Return the order with Firebase ID
            return {
                ...orderData,
                firebaseId: result.name
            };
        } else {
            console.error('❌ Firebase API Error:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
        return null;
    }
}

/**
 * Get all orders from Firebase (for admin/testing)
 * API Method: GET
 * Endpoint: /orders.json
 */
async function getAllOrdersFromFirebase() {
    try {
        console.log('📡 Making GET request to Firebase API...');
        
        const response = await fetch(`${FIREBASE_CONFIG.databaseURL}/orders.json`);
        
        if (response.ok) {
            const orders = await response.json();
            console.log('✅ Retrieved orders from Firebase:', orders);
            return orders;
        } else {
            console.error('❌ Failed to retrieve orders');
            return null;
        }
    } catch (error) {
        console.error('❌ Error retrieving orders:', error);
        return null;
    }
}

/**
 * Get orders by email from Firebase
 * API Method: GET with query parameters
 */
async function getOrdersByEmail(email) {
    try {
        const url = `${FIREBASE_CONFIG.databaseURL}/orders.json?orderBy="email"&equalTo="${email}"`;
        console.log('📡 Querying orders by email:', url);
        
        const response = await fetch(url);
        
        if (response.ok) {
            const orders = await response.json();
            console.log('✅ Found orders for', email, ':', orders);
            return orders;
        }
    } catch (error) {
        console.error('❌ Error querying orders:', error);
        return null;
    }
}

/**
 * Update order status in Firebase
 * API Method: PATCH
 */
async function updateOrderStatus(firebaseId, newStatus) {
    try {
        console.log('📡 Making PATCH request to update order status...');
        
        const response = await fetch(`${FIREBASE_CONFIG.databaseURL}/orders/${firebaseId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: newStatus,
                updatedAt: new Date().toISOString()
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Order status updated:', result);
            return result;
        }
    } catch (error) {
        console.error('❌ Error updating order:', error);
        return null;
    }
}

// ===== HELPER FUNCTIONS =====

// Calculate total amount from cart
function calculateTotalAmount(cartData) {
    if (!cartData || cartData.length === 0) {
        return '0.00';
    }
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const serviceFee = subtotal * 0.05;
    return (subtotal + deliveryFee + serviceFee).toFixed(2);
}

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
    console.log('🧹 Clearing payment data from localStorage...');
    
    // Clear sensitive payment information
    localStorage.removeItem('cardNumber');
    localStorage.removeItem('cvv');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('userEmail');
    
    // Clear the cart after successful payment
    localStorage.removeItem('hawkerCart');
    
    // Keep orderTotals for a bit longer in case user refreshes
    // You can clear this manually or set a timeout
    
    console.log('✅ Payment data cleared');
}

// Download receipt as PDF (simplified version)
function downloadReceipt() {
    alert('Receipt download feature would be implemented here.\n\nIn a real application, this would generate a PDF receipt.');
}

// ===== TESTING FUNCTIONS (Remove before submission) =====

// Test function to view all orders in console
async function viewAllOrders() {
    const orders = await getAllOrdersFromFirebase();
    console.table(orders);
}

// Test function to query orders by email
async function testEmailQuery() {
    const email = document.getElementById('email').textContent;
    const orders = await getOrdersByEmail(email);
    console.log('Orders for this email:', orders);
}

// Expose functions for testing in browser console
window.viewAllOrders = viewAllOrders;
window.testEmailQuery = testEmailQuery;
window.saveOrderToFirebase = saveOrderToFirebase;