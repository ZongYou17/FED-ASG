document.addEventListener('DOMContentLoaded', () => {

    /* 🔹 Simulated logged-in hawker */
    const loggedInStall = "Chicken Rice Stall";

    document.getElementById("stall-name").textContent =
        `Stall Name: ${loggedInStall}`;

    
    const hawkerCentreImages = {
        "Maxwell Food Centre": "images/maxwell.png",
        "Chinatown Complex": "images/chinatown.png",
        "Old Airport Road Food Centre": "images/oldairport.png",
        "Tiong Bahru Market": "images/tiongbahru.png"
    };

    /* 🔹 Load and filter orders */
    const allOrders = JSON.parse(localStorage.getItem("hawkerOrders")) || [];
    const hawkerOrders = allOrders.filter(
        order => order.stallName === loggedInStall
    );

    const orderList = document.getElementById("order-list");

    if (hawkerOrders.length === 0) {
        orderList.innerHTML = "<p>No orders available.</p>";
        return;
    }

    /* 🔹 Hawker centre display */
    const hawkerCentre = hawkerOrders[0].hawkerCentre;
    const hawkerImage = document.getElementById("hawker-image");
    const hawkerCentreName = document.getElementById("hawker-centre-name");

    hawkerCentreName.textContent = hawkerCentre;

    if (hawkerCentreImages[hawkerCentre]) {
        hawkerImage.src = hawkerCentreImages[hawkerCentre];
    } else {
        hawkerImage.style.display = "none";
    }

    /* 🔹 Render order cards */
    hawkerOrders.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.className = "order-card";

        let itemsHTML = "";
        order.items.forEach(item => {
            itemsHTML += `<li>${item.name} × ${item.quantity}</li>`;
        });

        orderCard.innerHTML = `
            <h3>${order.orderNumber}</h3>
            <p><strong>Date:</strong> ${order.dateTime}</p>
            <p class="status"><strong>Status:</strong> ${order.status}</p>
            <ul>${itemsHTML}</ul>
        `;

        orderList.appendChild(orderCard);
    });
});
