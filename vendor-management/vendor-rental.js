document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlight
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Highlight active nav item
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'vendor-rental.html') {
            link.style.background = '#0066cc';
            link.style.color = 'white';
            link.style.borderColor = '#0066cc';
        }
        
        link.addEventListener('click', function() {
            // Reset all nav links
            navLinks.forEach(l => {
                l.style.background = '#f0f0f0';
                l.style.color = '#333';
                l.style.borderColor = '#ccc';
            });
            
            // Highlight clicked link
            this.style.background = '#0066cc';
            this.style.color = 'white';
            this.style.borderColor = '#0066cc';
        });
    });
    
    // DOM Elements for renewal modal
    const renewButton = document.getElementById('renewAgreement');
    const renewModal = document.getElementById('renewModal');
    const renewSuccess = document.getElementById('renewSuccess');
    const closeRenewModalBtn = document.querySelector('.close-renew-modal');
    const cancelRenewBtn = document.getElementById('cancelRenew');
    const confirmRenewBtn = document.getElementById('confirmRenew');
    const closeRenewSuccessBtn = document.getElementById('closeRenewSuccess');
    const renewOptions = document.querySelectorAll('input[name="renewOption"]');
    const totalAmount = document.getElementById('totalAmount');
    const newEndDateEl = document.getElementById('newEndDate');
    const amountPaidEl = document.getElementById('amountPaid');
    
    // Renewal option prices and details
    const renewalOptions = {
        '1month': {
            amount: 5000,
            months: 1,
            newEndDate: '31 March 2026',
            display: '$5,000',
            monthlyFee: 5000
        },
        '3months': {
            amount: 14500,
            months: 3,
            newEndDate: '30 June 2026',
            display: '$14,500',
            monthlyFee: 5000
        },
        '6months': {
            amount: 28000,
            months: 6,
            newEndDate: '31 August 2026',
            display: '$28,000',
            monthlyFee: 5000
        }
    };
    
    // Set initial total amount
    let selectedOption = '1month';
    totalAmount.textContent = renewalOptions[selectedOption].display;
    
    // Update total when option changes
    renewOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedOption = this.value;
            totalAmount.textContent = renewalOptions[selectedOption].display;
        });
    });
    
    // Open renew modal
    function openRenewModal() {
        renewModal.classList.add('show');
    }
    
    // Close renew modal
    function closeRenewModal() {
        renewModal.classList.remove('show');
    }
    
    // Confirm renewal
    function confirmRenewal() {
        const option = renewalOptions[selectedOption];
        
        // Update success message
        newEndDateEl.textContent = option.newEndDate;
        amountPaidEl.textContent = option.display;
        
        // Close modal and show success
        closeRenewModal();
        renewSuccess.classList.add('show');
    }
    
    // Close success message
    function closeRenewSuccess() {
        renewSuccess.classList.remove('show');
    }
    
    // Event Listeners
    renewButton.addEventListener('click', openRenewModal);
    closeRenewModalBtn.addEventListener('click', closeRenewModal);
    cancelRenewBtn.addEventListener('click', closeRenewModal);
    confirmRenewBtn.addEventListener('click', confirmRenewal);
    closeRenewSuccessBtn.addEventListener('click', closeRenewSuccess);
    
    // Close modal when clicking outside
    renewModal.addEventListener('click', function(e) {
        if (e.target === renewModal) {
            closeRenewModal();
        }
    });
    
    // Close success when clicking outside
    renewSuccess.addEventListener('click', function(e) {
        if (e.target === renewSuccess) {
            closeRenewSuccess();
        }
    });
});