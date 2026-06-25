// js/dashboard.js
function getAuthHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("ht_token")}`
  };
}
// ---------- INIT DASHBOARD ----------

function initDashboard() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const nameEl = document.getElementById("citizenName");
  if (nameEl) nameEl.textContent = user.email.split("@")[0];

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = () => {
    localStorage.removeItem("ht_token");
    localStorage.removeItem("ht_current_user");
    window.location.href = "index.html";
  };
}

// ---------- MAP ----------
let map;
let userMarker;

function initMap() {
  const defaultLat = 13.0827;
  const defaultLng = 80.2707;

  map = L.map("map").setView([defaultLat, defaultLng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
}

function locateUser() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      map.setView([lat, lng], 15);

      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        userMarker = L.marker([lat, lng]).addTo(map);
      }

      const locationInput = document.getElementById("reportLocation");
      if (locationInput) {
        locationInput.value = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
      }
    },
    () => alert("Unable to fetch your location")
  );
}

// ---------- SUBMIT COMPLAINT ----------
function initReportSubmission() {
  const form = document.getElementById("reportForm");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const issueType = document.getElementById("reportType").value;
    const location = document.getElementById("reportLocation").value;
    const description = document.getElementById("reportDesc").value;

    if (!issueType || !location) {
      alert("Please fill required fields");
      return;
    }

    const complaint = {
      title: issueType,
      description: description,
      category: issueType,
      latitude: 13.0827,
      longitude: 80.2707
    };

    try {
      const response = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(complaint)
      });

      if (response.ok) {
        alert("Complaint submitted successfully!");
        form.reset();
        loadMyReports();
        updateStats();
      } else {
        alert("Failed to submit complaint. Please try again.");
      }
    } catch (error) {
      alert("Cannot connect to server");
    }
  });
}

// ---------- LOAD MY REPORTS ----------
async function loadMyReports() {
  const tbody = document.getElementById("recentReportsBody");
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE}/complaints/my`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const complaints = await response.json();
      tbody.innerHTML = "";

      if (complaints.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No reports yet</td></tr>`;
        return;
      }

      complaints.forEach((c, index) => {
        const statusColor = c.status === "RESOLVED" ? "success" :
                           c.status === "ASSIGNED" ? "warning" : "secondary";
        tbody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${c.title}</td>
            <td>${c.wardNumber || "—"}</td>
            <td>${new Date(c.createdAt).toLocaleDateString()}</td>
            <td><span class="badge bg-${statusColor}">${c.status}</span></td>
            <td><button class="btn btn-sm btn-outline-secondary">View</button></td>
          </tr>
        `;
      });
    }
  } catch (error) {
    console.error("Error loading reports:", error);
  }
}

// ---------- UPDATE STATS ----------
async function updateStats() {
  try {
    const response = await fetch(`${API_BASE}/complaints/my`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const complaints = await response.json();

      const total = document.getElementById("statTotal");
      const open = document.getElementById("statOpen");
      const closed = document.getElementById("statClosed");

      if (total) total.textContent = complaints.length;
      if (open) open.textContent = complaints.filter(c => c.status === "PENDING" || c.status === "ASSIGNED").length;
      if (closed) closed.textContent = complaints.filter(c => c.status === "RESOLVED").length;
    }
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}

function requireProfileCompletion() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
  }
}