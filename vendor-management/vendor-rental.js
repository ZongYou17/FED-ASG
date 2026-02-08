document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBuMxvG1LW4dbez0-wB9H_zo0Ma298c2KM",
        authDomain: "hawker-hub-app.firebaseapp.com",
        databaseURL: "https://hawker-hub-app-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "hawker-hub-app",
        storageBucket: "hawker-hub-app.firebasestorage.app",
        messagingSenderId: "715705886479",
        appId: "1:715705886479:web:b3397022424f31832d407a",
        measurementId: "G-4YZN2KM4YE"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    
    // Vendor ID
    const vendorId = "vendor_001";
    
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
            display: '$5,000',
            rentalFee: 5000,
            successMessage: '1 Month Extension'
        },
        '3months': {
            amount: 14500,
            months: 3,
            display: '$14,500',
            rentalFee: 14500,
            successMessage: '3 Months Extension'
        },
        '6months': {
            amount: 28000,
            months: 6,
            display: '$28,000',
            rentalFee: 28000,
            successMessage: '6 Months Extension'
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
    
    // Close success message
    function closeRenewSuccess() {
        renewSuccess.classList.remove('show');
        // Refresh page to show updated data
        setTimeout(() => {
            location.reload();
        }, 300);
    }
    
    // Helper functions for date operations
    function formatDate(date) {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    
    function parseDate(dateString) {
        const parts = dateString.split(' ');
        const day = parseInt(parts[0]);
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames.indexOf(parts[1]);
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }
    
    function addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
    
    // Calculate the new end date based on selected option
    function calculateNewEndDate(months) {
        // Start date is always 1 February 2026
        const startDate = parseDate("1 February 2026");
        const newEndDate = addMonths(startDate, months);
        // Set to last day of the month
        newEndDate.setDate(0);
        return formatDate(newEndDate);
    }
    
    // Initialize Firebase data
    function initializeFirebaseData() {
        const rentalsRef = database.ref('vendors/' + vendorId + '/rentals');
        
        rentalsRef.once('value').then((snapshot) => {
            if (!snapshot.exists()) {
                // Create initial data structure
                const initialData = {
                    current: {
                        startDate: "1 January 2026",
                        endDate: "31 January 2026",
                        monthlyFee: 5000,
                        status: "expiring"
                    },
                    past: {
                        "rental1": {
                            startDate: "1 August 2025",
                            endDate: "31 August 2025",
                            monthlyFee: 5000,
                            status: "completed"
                        },
                        "rental2": {
                            startDate: "1 September 2025",
                            endDate: "30 September 2025",
                            monthlyFee: 5000,
                            status: "completed"
                        },
                        "rental3": {
                            startDate: "1 October 2025",
                            endDate: "31 October 2025",
                            monthlyFee: 5000,
                            status: "completed"
                        },
                        "rental4": {
                            startDate: "1 November 2025",
                            endDate: "30 November 2025",
                            monthlyFee: 5000,
                            status: "completed"
                        },
                        "rental5": {
                            startDate: "1 December 2025",
                            endDate: "31 December 2025",
                            monthlyFee: 5000,
                            status: "completed"
                        }
                    },
                    upcoming: {
                        startDate: "1 February 2026",
                        endDate: "28 February 2026",
                        rentalFee: 5000, // Default rental fee
                        status: "unrenewed" // Initially unrenewed
                    }
                };
                
                return rentalsRef.set(initialData);
            }
            return Promise.resolve();
        }).then(() => {
            // Load data after initialization
            loadRentalData();
        }).catch((error) => {
            console.error("Error initializing Firebase data:", error);
        });
    }
    
    // Load rental data from Firebase and update UI
    function loadRentalData() {
        const rentalsRef = database.ref('vendors/' + vendorId + '/rentals');
        
        rentalsRef.once('value').then((snapshot) => {
            if (snapshot.exists()) {
                const rentalData = snapshot.val();
                updateUI(rentalData);
            }
        }).catch((error) => {
            console.error("Error loading rental data:", error);
        });
    }
    
    // Update UI with data from Firebase
    function updateUI(rentalData) {
        // Update upcoming rental based on Firebase data
        if (rentalData.upcoming) {
            // Get all the upcoming rental elements
            const upcomingSection = document.querySelector('.rental-container .rental-section:nth-child(3) .rental-details');
            if (upcomingSection) {
                const feeLabel = upcomingSection.querySelector('li:nth-child(3) .detail-label');
                if (feeLabel && feeLabel.textContent === 'Monthly rental fee:') {
                    feeLabel.textContent = 'Rental fee:';
                }
                
                // Update the values
                const startDateEl = upcomingSection.querySelector('li:nth-child(1) .detail-value');
                const endDateEl = upcomingSection.querySelector('li:nth-child(2) .detail-value');
                const rentalFeeEl = upcomingSection.querySelector('li:nth-child(3) .detail-value');
                const statusEl = upcomingSection.querySelector('li:nth-child(4) .detail-value');
                
                if (startDateEl) startDateEl.textContent = rentalData.upcoming.startDate;
                if (endDateEl) endDateEl.textContent = rentalData.upcoming.endDate;
                if (rentalFeeEl) rentalFeeEl.textContent = '$' + rentalData.upcoming.rentalFee.toLocaleString();
                
                if (statusEl) {
                    if (rentalData.upcoming.status === "renewed") {
                        statusEl.textContent = 'Renewed';
                        statusEl.className = 'detail-value status-renewed';
                    } else {
                        statusEl.textContent = 'Unrenewed';
                        statusEl.className = 'detail-value status-unrenewed';
                    }
                }
            }
        }
    }
    
    // Confirm renewal
    function confirmRenewal() {
        const option = renewalOptions[selectedOption];
        
        // Calculate new end date based on selected option
        let newEndDate;
        switch(selectedOption) {
            case '1month':
                newEndDate = "28 February 2026";
                break;
            case '3months':
                newEndDate = "30 April 2026";
                break;
            case '6months':
                newEndDate = "31 July 2026";
                break;
            default:
                newEndDate = "28 February 2026";
        }
        
        // Get current rental data from Firebase
        const rentalsRef = database.ref('vendors/' + vendorId + '/rentals');
        
        rentalsRef.once('value').then((snapshot) => {
            if (!snapshot.exists()) {
                alert("Error: No rental data found");
                return;
            }
            
            // Create updated upcoming rental data
            const upcomingData = {
                startDate: "1 February 2026", // Always starts 1 Feb 2026
                endDate: newEndDate,
                rentalFee: option.rentalFee,
                status: "renewed",
                renewalOption: selectedOption,
                renewedDate: new Date().toISOString()
            };
            
            return rentalsRef.update({
                upcoming: upcomingData
            });
        }).then(() => {
            // Create payment record
            const paymentRef = database.ref('vendors/' + vendorId + '/payments/' + Date.now());
            return paymentRef.set({
                amount: option.amount,
                date: new Date().toISOString(),
                description: `${option.successMessage}`,
                period: "1 February 2026 to " + newEndDate,
                status: "paid",
                option: selectedOption
            });
        }).then(() => {
            // Update success message
            newEndDateEl.textContent = newEndDate;
            amountPaidEl.textContent = option.display;
            
            // Close modal and show success
            closeRenewModal();
            renewSuccess.classList.add('show');
            
            console.log("Upcoming rental updated in Firebase: " + selectedOption + " option selected");
            
            // Update the UI immediately
            loadRentalData();
            
        }).catch((error) => {
            console.error("Error updating rental:", error);
            alert("Error processing renewal. Please try again.");
        });
    }
    
    // Event Listeners
    renewButton.addEventListener('click', openRenewModal);
    closeRenewModalBtn.addEventListener('click', closeRenewModal);
    cancelRenewBtn.addEventListener('click', closeRenewModal);
    confirmRenewBtn.addEventListener('click', confirmRenewal);
    closeRenewSuccessBtn.addEventListener('click', function() {
        closeRenewSuccess();
    });
    
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (renewModal.classList.contains('show')) {
                closeRenewModal();
            }
            if (renewSuccess.classList.contains('show')) {
                closeRenewSuccess();
            }
        }
    });
    
    // Initialize Firebase data and load rental data
    initializeFirebaseData();
});