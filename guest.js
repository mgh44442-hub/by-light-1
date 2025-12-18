function generateGuestId(){
  let id = localStorage.getItem("guestId");
  if(!id){
    id = "GUEST-" + Math.random().toString(36).substr(2,10).toUpperCase();
    localStorage.setItem("guestId", id);
  }
  return id;
}

function guestLogin(){
  const guest = {
    id: generateGuestId(),
    user: "Guest"
  };

  localStorage.setItem("loggedUser", JSON.stringify(guest));
  location.href = "home.html";
}
