/*************************
 * SUPPORT AUTH
 *************************/
const SUPPORT_USER = "support";
const SUPPORT_PASS = "admin@123";

function supportLogin() {
  let u = document.getElementById("supportUser").value.trim();
  let p = document.getElementById("supportPass").value.trim();

  if (u === SUPPORT_USER && p === SUPPORT_PASS) {
    localStorage.setItem("supportAuth", "true");
    location.href = "support-dashboard.html";
  } else {
    alert("Wrong support credentials");
  }
}

function checkSupportAuth() {
  if (!localStorage.getItem("supportAuth")) {
    location.href = "support-login.html";
  }
}

function supportLogout() {
  localStorage.removeItem("supportAuth");
  location.href = "support-login.html";
}

/*************************
 * USERS MANAGEMENT
 *************************/
function generateUserId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 14; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function createUser() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = document.getElementById("newUser").value.trim();
  let pass = document.getElementById("newPass").value.trim();

  if (!user || !pass) {
    alert("Fill all fields");
    return;
  }

  if (users.find(u => u.user === user)) {
    alert("Username already exists");
    return;
  }

  let id = generateUserId();

  users.push({
    user: user,
    pass: pass,
    id: id
  });

  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("newUser").value = "";
  document.getElementById("newPass").value = "";

  loadUsers();
}

function loadUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let box = document.getElementById("usersList");
  if (!box) return;

  box.innerHTML = "";

  users.forEach(u => {
    box.innerHTML += `
      <div class="card user-card">
        <div><strong>${u.user}</strong></div>
        <div>ID: ${u.id}</div>
      </div>
    `;
  });
}

/*************************
 * ORDERS MANAGEMENT
 *************************/
function loadOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let box = document.getElementById("ordersList");
  if (!box) return;

  box.innerHTML = "";

  orders.forEach((o, i) => {
    box.innerHTML += `
      <div class="card">
        <div><strong>Service:</strong> ${o.service}</div>
        <div><strong>Qty:</strong> ${o.qty}</div>
        <div><strong>Link:</strong> ${o.link || "-"}</div>
        <div><strong>Status:</strong> ${o.status}</div>
        <button onclick="approveOrder(${i})">Approve</button>
      </div>
    `;
  });
}

function approveOrder(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders[index].status = "Approved";
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}
