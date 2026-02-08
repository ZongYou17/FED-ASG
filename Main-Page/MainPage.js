// Navigate to hawker centre details page
function goToHawkerCentre(hawkerId) {
    const hawkerPages = {
        'maxwell': 'Maxwell-SelectStall.html',
        'Lau-Pa-Sat': 'LauPaSat-SelectStall.html',
        'Chinatown Complex': 'ChinatownComplex-SelectStall.html',
        'Tekka Centre': 'TekkaCentre-SelectStall.html',
        'Old Airport Road': 'OldAirportRoad-SelectStall.html',
        'Tiong Bahru': 'TiongBahru-SelectStall.html',
    };
    const pageFile = hawkerPages[hawkerId];
    if (pageFile) {
        window.location.href = '../Ordering & CheckOut/SelectHawkerCentrePage/' + pageFile;
    }
}

// Home button - go back to main page
function goHome() {
    window.location.href = 'MainPage.html';
}

// Login button functionality
function showLogin() {
    alert('Login feature coming soon!');
    // Later you can replace this with:
    // window.location.href = 'login.html';
}

// Vendor login button functionality
function showVendorLogin() {
    alert('Vendor login feature coming soon!');
    // Later you can replace this with:
    // window.location.href = 'vendor-login.html';
}

// Order history button functionality
function showOrderHistory() {
    alert('Order history feature coming soon!');
    // Later you can replace this with:
    // window.location.href = 'order-history.html';
}
// Feedback button functionality
function feedback() {
    window.location.href = '../Feedback/feedback.html';
    
}
// Cart button functionality
function viewCart() {
    window.location.href = '../Ordering & Checkout/Cart/cart.html';
}


// Load cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update the Cart button text to show count
    const cartButton = document.querySelector('.Cart');
    if (cartButton) {
        if (totalItems > 0) {
            cartButton.textContent = `Cart (${totalItems})`;
        } else {
            cartButton.textContent = 'Cart';
        }
    }
}
