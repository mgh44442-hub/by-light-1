/*************************
  ===== Support Auth =====
**************************/
const SUPPORT_USER = "support";
const SUPPORT_PASS = "admin@123";

function supportLogin() {
  const u = document.getElementById("supportUser").value.trim();
  const p = document.getElementById("supportPass").value;

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
  ===== Helpers =====
**************************/
function generateId(len = 14) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// Device ID (Guest)
function getDeviceId() {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = "DEVICE-" + generateId(14);
    localStorage.setItem("deviceId", id);
  }
  return id;
}

/*************************
  ===== Users (Support) =====
**************************/
function createUser() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = document.getElementById("newUser").value.trim();
  const pass = document.getElementById("newPass").value;

  if (!user || !pass) return alert("Fill all fields");

  if (users.find(u => u.user === user)) {
    return alert("Username already exists");
  }

  const id = generateId(14);

  users.push({ user, pass, id });
  localStorage.setItem("users", JSON.stringify(users));

  alert("User created successfully");

  document.getElementById("newUser").value = "";
  document.getElementById("newPass").value = "";

  loadUsers();
}

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const box = document.getElementById("usersList");
  if (!box) return;

  box.innerHTML = "";
  users.forEach(u => {
    box.innerHTML += `
      <div class="card">
        <strong>${u.user}</strong>
        <div>ID: ${u.id}</div>
      </div>
    `;
  });
}

/*************************
  ===== Orders (Admin) =====
**************************/
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const box = document.getElementById("ordersList");
  if (!box) return;

  box.innerHTML = "";

  orders.forEach((o, i) => {
    const completed = o.status === "Completed";

    box.innerHTML += `
      <div class="card">
        <p><strong>نوع الخدمة:</strong> ${o.serviceAr}</p>
        <p><strong>السعر:</strong> مجاني</p>
        <p><strong>الكمية:</strong> ${o.qty}</p>
        <p><strong>الرابط:</strong> ${o.link}</p>
        <p><strong>الحالة:</strong> ${completed ? "تمت العملية" : "قيد المراجعة"}</p>
        <p><strong>Owner ID:</strong> ${o.ownerId}</p>

        <button 
          onclick="approveOrder(${i})"
          ${completed ? "disabled" : ""}
        >
          ${completed ? "تمت العملية" : "تأكيد الطلب"}
        </button>
      </div>
    `;
  });
}

function approveOrder(index) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders[index].status = "Completed";
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}

/*************************
  ===== Orders (User + Guest) =====
**************************/
function placeOrder(service, serviceAr, maxQty, cooldownMinutes) {
  const qty = Number(document.getElementById("qty").value);
  const link = document.getElementById("link").value.trim();

  if (!link || !qty) return alert("Fill all fields");
  if (qty > maxQty) return alert(`Max allowed: ${maxQty}`);

  // owner (User OR Guest)
  let ownerId;
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  ownerId = user ? user.id : getDeviceId();

  // Limits
  let limits = JSON.parse(localStorage.getItem("limits")) || {};
  let now = Date.now();
  const limitKey = `${ownerId}_${service}`;

  if (limits[limitKey] && now < limits[limitKey]) {
    const remain = Math.ceil((limits[limitKey] - now) / 60000);
    return alert(`انتظر ${remain} دقيقة قبل الطلب مرة أخرى`);
  }

  limits[limitKey] = now + cooldownMinutes * 60000;
  localStorage.setItem("limits", JSON.stringify(limits));

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    ownerId,
    service,
    serviceAr,
    qty,
    link,
    status: "Waiting",
    created: new Date().toLocaleString()
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  alert("تم إرسال الطلب للمراجعة");
}

/*************************
  ===== Auth (User) =====
**************************/
function checkAuth() {
  // مسموح Guest
  if (!localStorage.getItem("loggedUser")) {
    getDeviceId();
  }
}

function logout() {
  localStorage.removeItem("loggedUser");
  location.href = "login.html";
}
