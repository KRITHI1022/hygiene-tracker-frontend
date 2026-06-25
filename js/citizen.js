// js/citizen.js

const currentUser = JSON.parse(localStorage.getItem("ht_current_user"));

// Block access if not logged in or wrong role
if (!currentUser || currentUser.role !== "CITIZEN") {
  window.location.href = "index.html";
}

// Set user name
function setText(id, value, fallback = "—") {
  const el = document.getElementById(id);
  if (el) el.textContent = value || fallback;
}

setText("citizenName", currentUser.email ? currentUser.email.split("@")[0] : "Citizen");