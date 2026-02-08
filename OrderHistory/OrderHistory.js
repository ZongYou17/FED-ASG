// Firebase config
const firebaseConfig = {
  databaseURL:
    "https://hawker-hub-app-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Stall → Image mapping
const stallImages = {
  // Maxwell
  "Tian Tian Hainanese Chicken Rice": "../images/stalls/maxwell/tiantian.jpg",
  "China Street Fritters": "../images/stalls/maxwell/chinastreetfritters.jpg",
  "Zhen Zhen Porridge": "../images/stalls/maxwell/zhenzhen.jpg",
  "Fried Kway Teow": "../images/stalls/maxwell/charkwayteow.jpg",
  "Selera Rasa Nasi Lemak": "../images/stalls/maxwell/selerarasa.jpg",
  "Maxwell Indian Muslim Food": "../images/stalls/maxwell/indianmuslim.jpg",

  // Lau Pa Sat
  "Satay Street": "../images/stalls/laupasat/sataystreet.jpg",
  "Thunder Tea Rice": "../images/stalls/laupasat/thundertearice.jpg",
  "Golden Shoe Hokkien Mee": "../images/stalls/laupasat/goldenshoe.jpg",
  "Ipoh Hainanese Chicken Rice": "../images/stalls/laupasat/ipohchickenrice.jpg",

  // Chinatown
  "Liao Fan Hawker Chan": "../images/stalls/chinatown/liaofan.jpg",
  "Lian He Ben Ji Claypot": "../images/stalls/chinatown/lianhebenji.jpg",
  "Old Amoy Chendol": "../images/stalls/chinatown/oldamoychendol.jpg"
};

const container = document.getElementById("orderHistoryContainer");
const filter = document.getElementById("hawkerFilter");

let allOrders = [];

function renderOrders(hawker) {
  container.innerHTML = "";

  const filtered =
    hawker === "all"
      ? allOrders
      : allOrders.filter(o => o.hawkerCentre === hawker);

  if (filtered.length === 0) {
    container.innerHTML = "<p>No orders found.</p>";
    return;
  }

  filtered.forEach(order => {
    const img =
      stallImages[order.stallName] ||
      "../images/stalls/default-stall.jpg";

    const card = document.createElement("div");
    card.className = "order-card";

    card.innerHTML = `
      <img src="${img}" alt="${order.stallName}">
      <div class="order-content">
        <h3>${order.stallName}</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <span class="hawker-badge">${order.hawkerCentre}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// Fetch from Firebase
firebase
  .database()
  .ref("orders")
  .on("value", snapshot => {
    allOrders = [];

    snapshot.forEach(child => {
      allOrders.push({
        orderId: child.key,
        ...child.val()
      });
    });

    renderOrders(filter.value);
  });

// Filter change
filter.addEventListener("change", () => {
  renderOrders(filter.value);
});
