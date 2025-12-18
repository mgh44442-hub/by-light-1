function login(){
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const found = users.find(u => u.user === user && u.pass === pass);

  if(!found){
    alert("Wrong username or password");
    return;
  }

  localStorage.setItem("loggedUser", JSON.stringify(found));
  location.href = "home.html";
}
