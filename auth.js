function checkAuth(){
  if(!localStorage.getItem("loggedUser")){
    location.href = "login.html";
  }
}

function logout(){
  localStorage.removeItem("loggedUser");
  location.href = "login.html";
}
