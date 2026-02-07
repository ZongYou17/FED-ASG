function goToMenu(stallId) {
    const stallPages = {
        'Tian-Tian-Chicken-Rice': '../Fooditem Page/TianTianChickenRice.html',
        'China Street Fritters': '../FoodItem Page/ChinaStreetFritters.html',
        'Zhen ZHen Porridge': '../FoodItem Page/ZhenZhenPorridge.html',
        'Maxwell Fuzhou Oyster Cake': '../FoodItem Page/MaxwellFuzhouOysterCake.html',
        'Hainanese Curry Rice': '../FoodItem Page/HainaneseCurryRice.html'
    };
    const pageFile = stallPages[stallId];
    if (pageFile) {
        window.location.href = '../FoodItem Page/' + pageFile;
    }
}

// Filter stalls by category
function filterStalls(category) {
    const stalls = document.querySelectorAll('.stall-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter stalls
    stalls.forEach(stall => {
        if (category === 'all' || stall.dataset.category === category) {
            stall.style.display = 'block';
        } else {
            stall.style.display = 'none';
        }
    });
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const stalls = document.querySelectorAll('.stall-card');
            
            stalls.forEach(stall => {
                const stallName = stall.querySelector('h3').textContent.toLowerCase();
                const cuisineType = stall.querySelector('.cuisine-type').textContent.toLowerCase();
                
                if (stallName.includes(searchTerm) || cuisineType.includes(searchTerm)) {
                    stall.style.display = 'block';
                } else {
                    stall.style.display = 'none';
                }
            });
        });
    }
});

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

// Show cart page
function viewCart() {
    window.location.href = '../Cart/cart.html';
}