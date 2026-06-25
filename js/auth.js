// js/auth.js

const API_BASE = "http://localhost:8080/api";

// ---------- TOKEN UTILITIES ----------
function saveToken(token) {
  localStorage.setItem("ht_token", token);
}

function getToken() {
  return localStorage.getItem("ht_token");
}

function saveCurrentUser(user) {
  localStorage.setItem("ht_current_user", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("ht_current_user"));
}

function logout() {
  localStorage.removeItem("ht_token");
  localStorage.removeItem("ht_current_user");
  window.location.href = "index.html";
}

// ---------- REGISTRATION ----------
async function registerUser({ name, email, password, role, wardNumber }) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, wardNumber })
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.token);
      saveCurrentUser({ email, role: data.role, userId: data.userId });
      return { success: true, role: data.role };
    } else {
      return { success: false, message: data.message || "Registration failed" };
    }
  } catch (error) {
    return { success: false, message: "Cannot connect to server" };
  }
}

// ---------- LOGIN ----------
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.token);
      saveCurrentUser({ email, role: data.role, userId: data.userId });
      return { success: true, role: data.role };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    return { success: false, message: "Cannot connect to server" };
  }
}

// ---------- AUTH HEADER ----------
function getAuthHeader() {
  return { "Authorization": `Bearer ${getToken()}` };
}

// ---------- GUARDS ----------
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "index.html";
  }
}

function redirectToDashboard(role) {
  if (role === "OFFICIAL") {
    window.location.href = "official-dashboard.html";
  } else {
    window.location.href = "citizen-dashboard.html";
  }
}