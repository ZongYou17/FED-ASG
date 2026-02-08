document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("orderHistoryContainer");
  const filter = document.getElementById("hawkerFilter");

  // Fake order data (stored once)
  if (!localStorage.getItem("orders")) {
    const sampleOrders = [
      {
        hawker: "Maxwell Food Centre",
        stall: "Tian Tian Chicken Rice",
        total: "$6.50",
        date: "2026-02-01"
      },
      {
        hawker: "Lau Pa Sat",
        stall: "Satay Stall",
        total: "$12.00",
        date: "2026-02-05"
      },
      {
        hawker: "Chinatown Complex",
        stall: "Roast Meat Store",
        total: "$8.00",
        date: "2026-02-06"
      }
    ];
    localStorage.setItem("orders", JSON.stringify(sampleOrders));
  }

  const orders = JSON.parse(localStorage.getItem("orders"));

  function renderOrders(selected = "all") {
    container.innerHTML = "";

    const filteredOrders =
      selected === "all"
        ? orders
        : orders.filter(order => order.hawker === selected);

    if (filteredOrders.length === 0) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    filteredOrders.forEach(order => {
      const card = document.createElement("div");
      card.className = "order-card";
      card.innerHTML = `
        <h3>${order.stall}</h3>
        <p><strong>Hawker:</strong> ${order.hawker}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Date:</strong> ${order.date}</p>
      `;
      container.appendChild(card);
    });
  }

  filter.addEventListener("change", e => {
    renderOrders(e.target.value);
  });

  renderOrders();
});
