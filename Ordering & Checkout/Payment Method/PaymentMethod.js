// Payment method data
const paymentMethods = [
    { id: 'applepay', name: 'Apple Pay', icon: '📱' },
    { id: 'card', name: 'Credit or Debit Card', icon: '💳' },
    { id: 'payNow', name: 'PayNow', icon: '🏦' },
    { id: 'cash', name: 'Cash', icon: '💵' }
];

let selectedMethod = '';

// Initialize the page
function init() {
    renderPaymentMethods();
    setupEventListeners();
}

// Render payment method buttons
function renderPaymentMethods() {
    const container = document.getElementById('paymentMethods');
    
    paymentMethods.forEach(method => {
        const button = document.createElement('button');
        button.className = 'payment-option';
        button.dataset.method = method.id;
        
        button.innerHTML = `
            <div class="payment-info">
                <span class="payment-icon">${method.icon}</span>
                <span class="payment-name">${method.name}</span>
            </div>
            <div class="radio-button">
                <div class="radio-inner"></div>
            </div>
        `;
        
        button.addEventListener('click', () => selectPaymentMethod(method.id));
        container.appendChild(button);
    });
}

// Select payment method
function selectPaymentMethod(methodId) {
    selectedMethod = methodId;
    
    // Update UI
    const allButtons = document.querySelectorAll('.payment-option');
    allButtons.forEach(button => {
        if (button.dataset.method === methodId) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

// Handle confirm button
function handleConfirm() {
    if (selectedMethod) {
        // Redirect to specific payment page based on selected method
        switch(selectedMethod) {
            case 'applepay':
                window.location.href = 'Apple Pay/ApplePay.html';
                break;
            case 'card':
                window.location.href = 'Credit Card/CreditCard.html';
                break;
            case 'payNow':
                window.location.href = 'PayNow/Paynow.html';
                break;
            case 'cash':
                window.location.href = 'Cash/Cash.html';
                break;
            default:
                alert('Invalid payment method');
        }
    } else {
        alert('Please select a payment method');
    }
}

// Setup event listeners
function setupEventListeners() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.addEventListener('click', handleConfirm);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);