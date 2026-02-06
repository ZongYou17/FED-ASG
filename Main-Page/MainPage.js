// Navigate to hawker centre details page
function goToHawkerCentre(hawkerId) {
    // Redirect to hawker details page with the selected hawker centre
    window.location.href = '../Order-Page/Order-SelectStall.html?centre=' + hawkerId;
}

// Home button - go back to main page
function goHome() {
    window.location.href = 'index.html';
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

// Cart button functionality
function showCart() {
    alert('Cart feature coming soon!');
    // Later you can replace this with:
    // window.location.href = 'cart.html';
}