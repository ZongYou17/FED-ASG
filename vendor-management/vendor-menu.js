document.addEventListener('DOMContentLoaded', function() {
    // Firebase Configuration
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
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Get database reference
    const database = firebase.database();
    const menuRef = database.ref('menu');
    
    // Navigation highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'vendor-menu.html') {
            link.style.background = '#0066cc';
            link.style.color = 'white';
            link.style.borderColor = '#0066cc';
        }
        
        link.addEventListener('click', function() {
            navLinks.forEach(l => {
                l.style.background = '#f0f0f0';
                l.style.color = '#333';
                l.style.borderColor = '#ccc';
            });
            this.style.background = '#0066cc';
            this.style.color = 'white';
            this.style.borderColor = '#0066cc';
        });
    });
    
    // DOM Elements
    const removeModal = document.getElementById('removeModal');
    const removeSuccess = document.getElementById('removeSuccess');
    const closeRemoveModalBtn = document.querySelector('.close-remove-modal');
    const cancelRemoveBtn = document.getElementById('cancelRemove');
    const confirmRemoveBtn = document.getElementById('confirmRemove');
    const closeRemoveSuccessBtn = document.getElementById('closeRemoveSuccess');
    const itemNameDisplay = document.getElementById('itemNameDisplay');
    const itemPriceDisplay = document.getElementById('itemPriceDisplay');
    const removedItemNameDisplay = document.getElementById('removedItemName');
    const addItemCard = document.querySelector('.add-item-card');
    
    let currentItemToRemove = null;
    let currentItemId = null;
    let selectedImageFile = null;
    
    // Load menu from Firebase
    function loadMenuFromFirebase() {
        console.log("Loading from Firebase...");
        
        menuRef.once('value')
            .then((snapshot) => {
                const menuItems = snapshot.val();
                if (menuItems) {
                    console.log("✅ Loaded from Firebase");
                    updateMenuFromFirebase(menuItems);
                } else {
                    console.log("⚠️ No data in Firebase");
                    saveInitialMenuToFirebase();
                }
            })
            .catch((error) => {
                console.error("❌ Firebase error:", error);
            });
    }
    
    function saveInitialMenuToFirebase() {
        const menuItems = {};
        
        // Get all existing menu items from page
        document.querySelectorAll('.menu-item-card:not(.add-item-card)').forEach(card => {
            const id = card.getAttribute('data-item-id');
            const name = card.querySelector('.menu-item-title').textContent;
            const price = parseFloat(card.querySelector('.menu-item-price').textContent.replace('$', ''));
            const likes = parseInt(card.querySelector('.likes-number').textContent) || 0;
            
            // Get cuisine types
            const cuisineTypes = [];
            card.querySelectorAll('.cuisine-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
                cuisineTypes.push(checkbox.nextElementSibling.textContent);
            });
            
            // Get image
            let imageUrl = 'images/nasi-lemak.png';
            
            if (name.includes('Chicken')) {
                imageUrl = 'images/chicken.png';
            } else if (name.includes('Satay')) {
                imageUrl = 'images/satay.png';
            } else if (name.includes('Nasi Lemak')) {
                imageUrl = 'images/nasi-lemak.png';
            }
            
            menuItems[id] = {
                id: id,
                name: name,
                price: price,
                likes: likes,
                cuisineTypes: cuisineTypes,
                imageUrl: imageUrl,
                deleted: false,  // Track deletion status
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
        });
        
        // Save to Firebase
        menuRef.set(menuItems)
            .then(() => {
                console.log("✅ Saved initial menu to Firebase");
                loadMenuFromFirebase();
            })
            .catch((error) => {
                console.error("❌ Save error:", error);
            });
    }
    
    function updateMenuFromFirebase(menuItems) {
        Object.keys(menuItems).forEach(itemId => {
            const item = menuItems[itemId];
            
            // If item is deleted, remove it from the page
            if (item.deleted === true) {
                const card = document.querySelector(`.menu-item-card[data-item-id="${itemId}"]`);
                if (card) {
                    card.remove();
                    console.log(`Removed deleted item: ${item.name}`);
                }
            } else {
                // Update existing card
                const card = document.querySelector(`.menu-item-card[data-item-id="${itemId}"]`);
                if (card) {
                    updateCardFromFirebase(card, item);
                } else {
                    // Add new card if it doesn't exist and isn't a default item
                    if (!['1', '2', '3', '4', '5'].includes(itemId)) {
                        addCardFromFirebase(item);
                    }
                }
            }
        });
    }
    
    function updateCardFromFirebase(card, item) {
        // Update likes
        const likesNumber = card.querySelector('.likes-number');
        if (likesNumber) likesNumber.textContent = item.likes || 0;
        
        // Update cuisine checkboxes
        const checkboxes = card.querySelectorAll('.cuisine-checkboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const cuisineName = checkbox.nextElementSibling.textContent;
            checkbox.checked = item.cuisineTypes && item.cuisineTypes.includes(cuisineName);
        });
        
        // Update image if it's a Firebase-stored item
        if (item.id && !['1', '2', '3', '4', '5'].includes(item.id)) {
            const imageElement = card.querySelector('.menu-item-image img');
            if (imageElement) {
                if (item.imageUrl && item.imageUrl.startsWith('blob:')) {
                    let defaultImage = getImageByItemName(item.name);
                    imageElement.src = defaultImage;
                    updateImageUrlInFirebase(item.id, defaultImage);
                } else if (item.imageUrl) {
                    imageElement.src = item.imageUrl;
                }
            }
        }
    }
    
    function getImageByItemName(itemName) {
        const nameLower = itemName.toLowerCase();
        if (nameLower.includes('chicken')) {
            return 'images/chicken.png';
        } else if (nameLower.includes('satay')) {
            return 'images/satay.png';
        } else if (nameLower.includes('nasi lemak')) {
            return 'images/nasi-lemak.png';
        }
    }
    
    function updateImageUrlInFirebase(itemId, imageUrl) {
        menuRef.child(itemId).update({
            imageUrl: imageUrl,
            updatedAt: Date.now()
        })
        .then(() => console.log("✅ Image URL updated in Firebase"))
        .catch(error => console.error("❌ Image update error:", error));
    }
    
    function addCardFromFirebase(item) {
        const menuGrid = document.querySelector('.menu-grid:last-child');
        const addItemCard = menuGrid.querySelector('.add-item-card');
        
        const newCard = createMenuCard(item);
        if (newCard && addItemCard) {
            menuGrid.insertBefore(newCard, addItemCard);
            setupCardEvents(newCard);
        }
    }
    
    // Setup remove button events for existing items
    function setupRemoveButtons() {
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                currentItemToRemove = this;
                currentItemId = this.closest('.menu-item-card').getAttribute('data-item-id');
                
                const itemName = this.getAttribute('data-item-name');
                const itemPrice = this.getAttribute('data-item-price');
                
                itemNameDisplay.textContent = itemName;
                itemPriceDisplay.textContent = itemPrice;
                removeModal.classList.add('show');
            });
        });
    }
    
    // Setup cuisine checkbox events
    function setupCuisineCheckboxes() {
        document.querySelectorAll('.cuisine-checkboxes input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const card = this.closest('.menu-item-card');
                const itemId = card.getAttribute('data-item-id');
                const selectedCuisines = getSelectedCuisines(card);
                updateCuisineTypesInFirebase(itemId, selectedCuisines);
            });
        });
    }
    
    function getSelectedCuisines(card) {
        const selectedCuisines = [];
        card.querySelectorAll('.cuisine-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
            selectedCuisines.push(checkbox.nextElementSibling.textContent);
        });
        return selectedCuisines;
    }
    
    function updateCuisineTypesInFirebase(itemId, cuisineTypes) {
        menuRef.child(itemId).update({
            cuisineTypes: cuisineTypes,
            updatedAt: Date.now()
        })
        .then(() => console.log("✅ Cuisine updated"))
        .catch(error => console.error("❌ Update error:", error));
    }
    
    // Add new item to Firebase
    async function addToFirebase(itemData) {
        try {
            let imageUrl = getImageByItemName(itemData.name);
            let tempImageUrl = null;
            
            if (selectedImageFile) {
                tempImageUrl = URL.createObjectURL(selectedImageFile);
            }
            
            const newItemRef = menuRef.push();
            const newItemId = newItemRef.key;
            
            const item = {
                id: newItemId,
                name: itemData.name,
                price: itemData.price,
                cuisineTypes: itemData.cuisineTypes,
                imageUrl: imageUrl,
                likes: 0,
                deleted: false,  // New items are not deleted
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            
            await newItemRef.set(item);
            console.log("✅ Added to Firebase:", item.name);
            
            addToPage(item, tempImageUrl);
            showSuccess('Added!', `${item.name} added to menu.`);
            
        } catch (error) {
            console.error("❌ Add error:", error);
            alert("Add failed: " + error.message);
        }
    }
    
    // Remove from Firebase
    function removeFromFirebase(itemId) {
        menuRef.child(itemId).update({
            deleted: true,
            updatedAt: Date.now()
        })
            .then(() => {
                console.log("✅ Marked as deleted in Firebase:", itemId);
                
                // Remove from page
                const card = document.querySelector(`.menu-item-card[data-item-id="${itemId}"]`);
                if (card) {
                    card.remove();
                }
                
                showSuccess('Removed!', 'Item removed successfully.');
            })
            .catch((error) => {
                console.error("❌ Remove error:", error);
                alert("Remove failed: " + error.message);
            });
    }
    
    // Add new item to page
    function addToPage(item, tempImageUrl = null) {
        const menuGrids = document.querySelectorAll('.menu-grid');
        let targetGrid = menuGrids[menuGrids.length - 1];
        const addItemCard = targetGrid.querySelector('.add-item-card');
        
        const newCard = createMenuCard(item, tempImageUrl);
        if (newCard && addItemCard) {
            targetGrid.insertBefore(newCard, addItemCard);
            setupCardEvents(newCard);
        }
    }
    
    function createMenuCard(item, tempImageUrl = null) {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.setAttribute('data-item-id', item.id);
        
        const cuisineOptions = [
            { id: 'sg', label: 'Malaysian', value: 'Malaysian' },
            { id: 'my', label: 'Indonesian', value: 'Indonesian' },
            { id: 'id', label: 'Singaporean', value: 'Singaporean' },
            { id: 'ch', label: 'Chinese', value: 'Chinese' },
            { id: 'kor', label: 'Korean', value: 'Korean' },
            { id: 'jp', label: 'Japanese', value: 'Japanese' },
            { id: 'in', label: 'Indian', value: 'Indian' },
            { id: 'west', label: 'Western', value: 'Western' }
        ];
        
        const cuisineHTML = cuisineOptions.map(cuisine => `
            <div class="cuisine-option">
                <input type="checkbox" id="${item.id}-${cuisine.id}" 
                       value="${cuisine.value}"
                       ${item.cuisineTypes && item.cuisineTypes.includes(cuisine.value) ? 'checked' : ''}>
                <label for="${item.id}-${cuisine.id}">${cuisine.label}</label>
            </div>
        `).join('');
        
        const displayImageUrl = tempImageUrl || item.imageUrl;
        
        card.innerHTML = `
            <div class="menu-item-header">
                <h3 class="menu-item-title">${item.name}</h3>
                <div class="menu-item-price">$${parseFloat(item.price).toFixed(2)}</div>
            </div>
            
            <div class="menu-item-image">
                <img src="${displayImageUrl}" alt="${item.name}">
            </div>
            
            <button class="change-image-btn">Change Image</button>
            
            <div class="menu-item-details">
                <div class="cuisine-types">
                    <h4>Cuisine type:</h4>
                    <div class="cuisine-checkboxes">
                        ${cuisineHTML}
                    </div>
                </div>
                
                <div class="likes-count">
                    <span class="star-icon">★</span>
                    Number of likes: <span class="likes-number">${item.likes || 0}</span>
                </div>
            </div>
            
            <button class="remove-item-btn" 
                    data-item-name="${item.name}" 
                    data-item-price="$${parseFloat(item.price).toFixed(2)}"
                    data-item-id="${item.id}">
                Remove Item
            </button>
        `;
        
        return card;
    }
    
    function setupCardEvents(card) {
        const removeBtn = card.querySelector('.remove-item-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                currentItemToRemove = this;
                currentItemId = this.getAttribute('data-item-id');
                
                const itemName = this.getAttribute('data-item-name');
                const itemPrice = this.getAttribute('data-item-price');
                
                itemNameDisplay.textContent = itemName;
                itemPriceDisplay.textContent = itemPrice;
                removeModal.classList.add('show');
            });
        }
        
        const checkboxes = card.querySelectorAll('.cuisine-checkboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const card = this.closest('.menu-item-card');
                const itemId = card.getAttribute('data-item-id');
                const selectedCuisines = getSelectedCuisines(card);
                updateCuisineTypesInFirebase(itemId, selectedCuisines);
            });
        });
    }
    
    function showSuccess(title, message) {
        if (currentItemToRemove) {
            removedItemNameDisplay.textContent = currentItemToRemove.getAttribute('data-item-name');
        }
        removeSuccess.classList.add('show');
    }
    
    function closeRemoveModal() {
        removeModal.classList.remove('show');
        currentItemToRemove = null;
        currentItemId = null;
    }
    
    function closeRemoveSuccess() {
        removeSuccess.classList.remove('show');
    }
    
    // Add new item modal
    function setupAddModal() {
        const addModalHTML = `
            <div id="addModal" class="remove-modal">
                <div class="remove-modal-content" style="max-width: 500px; max-height: 80vh; display: flex; flex-direction: column;">
                    <div class="remove-modal-header" style="flex-shrink: 0;">
                        <h3>Add New Menu Item</h3>
                        <button class="close-remove-modal" id="closeAddModal">&times;</button>
                    </div>
                    <div class="remove-modal-body" style="flex: 1; overflow-y: auto; padding: 20px 25px;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: bold; font-size: 14px;">Item Name:</label>
                            <input type="text" id="newItemName" style="width: 100%; padding: 8px 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="e.g., Nasi Lemak - XL">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: bold; font-size: 14px;">Price ($):</label>
                            <input type="number" id="newItemPrice" step="0.01" min="0" style="width: 100%; padding: 8px 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="e.g., 7.50">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: bold; font-size: 14px;">Item Image:</label>
                            <div style="border: 2px dashed #ddd; border-radius: 6px; padding: 15px; text-align: center; background: #f9f9f9;">
                                <div id="imagePreview" style="margin-bottom: 10px; min-height: 80px; display: flex; align-items: center; justify-content: center;">
                                    <div style="color: #666; font-size: 13px;">No image selected</div>
                                </div>
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                                    <button type="button" id="chooseImageBtn" style="background: #0066cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                        Choose Image
                                    </button>
                                    <button type="button" id="removeImageBtn" style="background: #f0f0f0; color: #333; border: 1px solid #ccc; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; display: none;">
                                        Remove
                                    </button>
                                </div>
                                <div style="font-size: 11px; color: #666; margin-top: 8px;">
                                    Recommended: JPEG, PNG, or GIF (max 5MB)
                                </div>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: bold; font-size: 14px;">Cuisine Types:</label>
                            <div class="cuisine-checkboxes" style="max-height: 120px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-sg" style="transform: scale(0.9);">
                                    <label for="new-sg" style="font-size: 13px;">Malaysian</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-my" style="transform: scale(0.9);">
                                    <label for="new-my" style="font-size: 13px;">Indonesian</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-id" style="transform: scale(0.9);">
                                    <label for="new-id" style="font-size: 13px;">Singaporean</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-ch" style="transform: scale(0.9);">
                                    <label for="new-ch" style="font-size: 13px;">Chinese</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-kor" style="transform: scale(0.9);">
                                    <label for="new-kor" style="font-size: 13px;">Korean</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-jp" style="transform: scale(0.9);">
                                    <label for="new-jp" style="font-size: 13px;">Japanese</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-in" style="transform: scale(0.9);">
                                    <label for="new-in" style="font-size: 13px;">Indian</label>
                                </div>
                                <div class="cuisine-option" style="margin-bottom: 6px;">
                                    <input type="checkbox" id="new-west" style="transform: scale(0.9);">
                                    <label for="new-west" style="font-size: 13px;">Western</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="remove-modal-footer" style="flex-shrink: 0;">
                        <button id="cancelAdd" class="remove-modal-btn cancel-remove-btn" style="padding: 10px 20px; font-size: 14px;">Cancel</button>
                        <button id="saveNewItem" class="remove-modal-btn confirm-remove-btn" style="background: #27ae60; padding: 10px 20px; font-size: 14px;">Add Item</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', addModalHTML);
        
        const addModal = document.getElementById('addModal');
        const closeAddModalBtn = document.getElementById('closeAddModal');
        const cancelAddBtn = document.getElementById('cancelAdd');
        const saveNewItemBtn = document.getElementById('saveNewItem');
        const chooseImageBtn = document.getElementById('chooseImageBtn');
        const removeImageBtn = document.getElementById('removeImageBtn');
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        
        addItemCard.addEventListener('click', function() {
            document.getElementById('newItemName').value = '';
            document.getElementById('newItemPrice').value = '';
            document.querySelectorAll('#addModal .cuisine-checkboxes input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            
            selectedImageFile = null;
            imagePreview.innerHTML = '<div style="color: #666; font-size: 13px;">No image selected</div>';
            removeImageBtn.style.display = 'none';
            
            addModal.classList.add('show');
        });
        
        function closeAddModal() {
            addModal.classList.remove('show');
            if (selectedImageFile) {
                const img = imagePreview.querySelector('img');
                if (img && img.src.startsWith('blob:')) {
                    URL.revokeObjectURL(img.src);
                }
            }
            selectedImageFile = null;
        }
        
        chooseImageBtn.addEventListener('click', function() {
            imageUpload.click();
        });
        
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.match('image.*')) {
                    alert('Please select an image file (JPEG, PNG, GIF)');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    return;
                }
                
                selectedImageFile = file;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 4px;">
                    `;
                    removeImageBtn.style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        removeImageBtn.addEventListener('click', function() {
            selectedImageFile = null;
            imageUpload.value = '';
            imagePreview.innerHTML = '<div style="color: #666; font-size: 13px;">No image selected</div>';
            removeImageBtn.style.display = 'none';
        });
        
        closeAddModalBtn.addEventListener('click', closeAddModal);
        cancelAddBtn.addEventListener('click', closeAddModal);
        
        saveNewItemBtn.addEventListener('click', async function() {
            const name = document.getElementById('newItemName').value.trim();
            const price = parseFloat(document.getElementById('newItemPrice').value);
            
            if (!name || isNaN(price) || price <= 0) {
                alert('Please enter a valid name and price.');
                return;
            }
            
            const cuisineTypes = [];
            document.querySelectorAll('#addModal .cuisine-checkboxes input[type="checkbox"]:checked').forEach(cb => {
                cuisineTypes.push(cb.nextElementSibling.textContent);
            });
            
            if (cuisineTypes.length === 0) {
                alert('Please select at least one cuisine type.');
                return;
            }
            
            saveNewItemBtn.textContent = 'Adding...';
            saveNewItemBtn.disabled = true;
            
            try {
                await addToFirebase({ 
                    name: name, 
                    price: price, 
                    cuisineTypes: cuisineTypes
                });
                closeAddModal();
            } catch (error) {
                alert('Failed to add item. Please try again.');
            } finally {
                saveNewItemBtn.textContent = 'Add Item';
                saveNewItemBtn.disabled = false;
            }
        });
        
        addModal.addEventListener('click', function(e) {
            if (e.target === addModal) closeAddModal();
        });
    }
    
    // Modal event listeners
    closeRemoveModalBtn.addEventListener('click', closeRemoveModal);
    cancelRemoveBtn.addEventListener('click', closeRemoveModal);
    confirmRemoveBtn.addEventListener('click', function() {
        if (currentItemId) {
            removeFromFirebase(currentItemId);
            closeRemoveModal();
        }
    });
    closeRemoveSuccessBtn.addEventListener('click', closeRemoveSuccess);
    
    removeModal.addEventListener('click', function(e) {
        if (e.target === removeModal) closeRemoveModal();
    });
    
    removeSuccess.addEventListener('click', function(e) {
        if (e.target === removeSuccess) closeRemoveSuccess();
    });
    
    // Initialize everything
    setupRemoveButtons();
    setupCuisineCheckboxes();
    setupAddModal();
    loadMenuFromFirebase();
});