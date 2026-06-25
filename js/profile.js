// js/profile.js

const API_BASE = "http://localhost:8080/api";

function getAuthHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("ht_token")}`
  };
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("ht_current_user"));
}

function requireProfileCompletion() {
  const token = localStorage.getItem("ht_token");
  if (!token) {
    window.location.href = "index.html";
  }
}

// ---------- LOAD PROFILE ----------
async function loadProfile() {
  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const user = await response.json();
      fillProfileForm(user);
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

// ---------- FILL FORM WITH USER DATA ----------
function fillProfileForm(user) {
  // Helper to safely set value
  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  // Fill form fields
  setVal("fullName", user.name);
  setVal("emailId", user.email);
  setVal("phoneNumber", user.phone);
  setVal("stateField", user.state);
  setVal("districtField", user.district);
  setVal("areaLocality", user.area);
  setVal("wardNumber", user.wardNumber);

  // Fill profile snapshot sidebar
  setText("snapshotName", user.name);
  setText("snapshotEmail", user.email);
  setText("snapshotArea", user.area);
  setText("snapshotDistrict", user.district);
  setText("snapshotState", user.state);

  // Fill header info
  setText("profileName", user.name || "Citizen");
  setText("profileRole", user.role);
  setText("profileWard", user.wardNumber ? "Ward " + user.wardNumber : "");
}

// ---------- SAVE PROFILE ----------
async function saveProfile() {
  const request = {
    name: document.getElementById("fullName")?.value,
    phone: document.getElementById("phoneNumber")?.value,
    state: document.getElementById("stateField")?.value,
    district: document.getElementById("districtField")?.value,
    area: document.getElementById("areaLocality")?.value,
    wardNumber: document.getElementById("wardNumber")?.value
  };

  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(request)
    });

    if (response.ok) {
      alert("Profile saved successfully!");
      const user = await response.json();
      fillProfileForm(user);
    } else {
      alert("Failed to save profile");
    }
  } catch (error) {
    alert("Cannot connect to server");
  }
}

// ---------- LOGOUT ----------
function logout() {
  localStorage.removeItem("ht_token");
  localStorage.removeItem("ht_current_user");
  window.location.href = "index.html";
}