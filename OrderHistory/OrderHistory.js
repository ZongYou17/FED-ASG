
const userId = "userId123"; // replace dynamically if you have auth
const baseURL = "https://hawker-hub-app-default-rtdb.asia-southeast1.firebasedatabase.app/orders/";
const container = document.getElementById("orderHistoryContainer");
const filterSelect = document.getElementById("hawkerFilter");

let allOrders = [];

fetch(`${baseURL}${userId}.json`)
  .then(res => res.json())
  .then(data => {
    if (!data) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    allOrders = Object.values(data).reverse();
    populateFilter(allOrders);
    renderOrders(allOrders);
  })
  .catch(() => {
    container.innerHTML = "<p>Failed to load order history.</p>";
  });

function populateFilter(orders) {
  const centres = [...new Set(orders.map(o => o.hawkerCentre))];
  centres.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filterSelect.appendChild(opt);
  });
}

filterSelect.addEventListener("change", () => {
  const value = filterSelect.value;
  const filtered =
    value === "all"
      ? allOrders
      : allOrders.filter(o => o.hawkerCentre === value);
  renderOrders(filtered);
});

function renderOrders(orders) {
  container.innerHTML = "";

  orders.forEach(order => {
    const date = new Date(order.timestamp).toLocaleString();
    let itemsHTML = "";

    order.items.forEach(item => {
      itemsHTML += `
        <div class="order-item">
          <span>${item.qty} × ${item.name}</span>
          <span>$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `;
    });

    container.innerHTML += `
      <div class="order-card">
        <div class="order-header">
          <h3>${order.stallName}</h3>
          <span class="status completed">${order.status}</span>
        </div>

        <div class="order-meta">
          <p>${order.hawkerCentre}</p>
          <p>${date}</p>
        </div>

        <div class="order-items">
          ${itemsHTML}
          <div class="total">Total: $${order.totalPrice.toFixed(2)}</div>
        </div>
      </div>
    `;
  });
}
