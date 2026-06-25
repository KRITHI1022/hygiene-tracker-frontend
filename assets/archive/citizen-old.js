// assets/js/citizen.js
// Citizen Dashboard — robust, Chennai-focused

const user = JSON.parse(localStorage.getItem("loggedInUser"));
const userNameEl = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const reportForm = document.getElementById("reportForm");
const reportTableBody = document.getElementById("reportTableBody");
const reportMsg = document.getElementById("reportMsg");

if (!user) {
  // no session — redirect
  window.location.href = "index.html";
} else {
  userNameEl.textContent = `Hi, ${user.name}`;
}

// Mock stats (can be connected to API later)
document.getElementById("binCount").innerText = 8;
document.getElementById("issueCount").innerText = 2;
document.getElementById("resolvedCount").innerText = 5;

// Map initialization (centered over Chennai)
const centerChennai = [13.0827, 80.2707];
const map = L.map("map", {
  center: centerChennai,
  zoom: 12,
  zoomControl: true,
  scrollWheelZoom: false,
});

// tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

// Chennai mock bins (realistic coordinates)
const sampleBins = [
  { lat: 13.0067, lng: 80.2570, area: "Mylapore", status: "Clean" },
  { lat: 13.0415, lng: 80.2348, area: "Velachery", status: "Needs cleaning" },
  { lat: 13.0623, lng: 80.2498, area: "Saidapet", status: "Overflowing" },
  { lat: 13.0674, lng: 80.2376, area: "Guindy", status: "Needs cleaning" },
  { lat: 13.0837, lng: 80.2700, area: "T. Nagar", status: "Overflowing" },
  { lat: 13.0785, lng: 80.2829, area: "Egmore", status: "Clean" },
  { lat: 13.1040, lng: 80.2120, area: "Anna Nagar", status: "Clean" },
  { lat: 13.005,  lng: 80.257,  area: "Marina Beach", status: "Needs cleaning" },
  { lat: 13.0398, lng: 80.2430, area: "Adyar", status: "Clean" }
];

const markers = [];
const bounds = [];

// create markers
sampleBins.forEach(b => {
  const color = b.status === "Clean" ? "#2ecc71" : (b.status === "Needs cleaning" ? "#f39c12" : "#e74c3c");
  const marker = L.circleMarker([b.lat, b.lng], {
    radius: 8,
    fillColor: color,
    color: "#ffffff",
    weight: 1,
    fillOpacity: 0.95
  }).addTo(map).bindPopup(`<strong>${b.area}</strong><br>Status: ${b.status}`);
  markers.push(marker);
  bounds.push([b.lat, b.lng]);
});

// fit map to bounds (with padding)
if (bounds.length) {
  try {
    map.fitBounds(bounds, { padding: [40, 40] });
  } catch (e) {
    // fallback to center
    map.setView(centerChennai, 12);
  }
}

// After layout & potential CSS load, force size recalculation
setTimeout(() => {
  map.invalidateSize();
}, 300);

// --- Reports (stored in localStorage) ---
let reports = JSON.parse(localStorage.getItem("citizenReports")) || [];

function renderReports() {
  reportTableBody.innerHTML = "";
  const userReports = reports.filter(r => r.email === (user?.email));
  if (userReports.length === 0) {
    reportTableBody.innerHTML = `<tr><td colspan="4" class="text-muted small">No reports yet</td></tr>`;
    return;
  }
  userReports.forEach((r, i) => {
    reportTableBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${r.location}</td>
        <td>${r.description}</td>
        <td><span class="badge ${r.status === 'Pending' ? 'bg-warning' : 'bg-success'}">${r.status}</span></td>
      </tr>`;
  });
}
renderReports();

reportForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  if (!location || !description) {
    reportMsg.textContent = "Please fill all fields.";
    reportMsg.style.color = "red";
    return;
  }
  const newReport = { email: user.email, location, description, status: "Pending", date: new Date().toLocaleString() };
  reports.push(newReport);
  localStorage.setItem("citizenReports", JSON.stringify(reports));
  reportMsg.textContent = "Report submitted successfully!";
  reportMsg.style.color = "#2b7a78";
  reportForm.reset();
  renderReports();
});

// Profile navigation
const profileBtn = document.getElementById("profileBtn");
profileBtn.addEventListener("click", () => {
  window.location.href = "profile.html";
});

// logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});
