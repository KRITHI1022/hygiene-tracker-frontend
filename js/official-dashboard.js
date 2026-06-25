// official-dashboard.js

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

// ---------- LOAD WARD COMPLAINTS ----------
async function loadAllReports() {
  const tbody = document.getElementById("officialReportsBody");
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE}/complaints/ward`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const complaints = await response.json();
      tbody.innerHTML = "";

      if (complaints.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No reports received</td></tr>`;
        return;
      }

      complaints.forEach((c, i) => {
        const statusColor = c.status === "RESOLVED" ? "success" :
                           c.status === "ASSIGNED" ? "warning" : "secondary";
        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>
              <strong>${c.title}</strong>
              <div class="small text-muted">${c.description || ""}</div>
            </td>
            <td>${c.citizen?.name || "Citizen"}</td>
            <td><span class="badge bg-${statusColor}">${c.status}</span></td>
            <td><span class="badge bg-danger">High</span></td>
            <td>
              <button class="btn btn-sm btn-outline-secondary me-1"
                onclick="assignCrew(${c.id})">Assign</button>
              <button class="btn btn-sm btn-theme"
                onclick="resolveComplaint(${c.id})">Resolve</button>
            </td>
          </tr>
        `;
      });

      // plot on map
      plotComplaintsOnMap(complaints);
    }
  } catch (error) {
    console.error("Error loading reports:", error);
  }
}

// ---------- UPDATE KPIs ----------
async function updateOfficialKPIs() {
  try {
    const response = await fetch(`${API_BASE}/complaints/ward`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const complaints = await response.json();

      document.getElementById("kpiTotal").textContent = complaints.length;
      document.getElementById("kpiPending").textContent =
        complaints.filter(c => c.status === "PENDING").length;
      document.getElementById("kpiAssigned").textContent =
        complaints.filter(c => c.status === "ASSIGNED").length;
      document.getElementById("kpiMTTR").textContent =
        complaints.length ? "6.2" : "--";
    }
  } catch (error) {
    console.error("Error updating KPIs:", error);
  }
}

// ---------- ASSIGN CREW ----------
async function assignCrew(complaintId) {
  const crewName = prompt("Enter crew name to assign:");
  if (!crewName) return;

  const user = getCurrentUser();

  try {
    const response = await fetch(`${API_BASE}/complaints/${complaintId}/assign`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({
        crewName: crewName,
        officialId: user.userId
      })
    });

    if (response.ok) {
      alert("Crew assigned successfully!");
      loadAllReports();
      updateOfficialKPIs();
    } else {
      alert("Failed to assign crew");
    }
  } catch (error) {
    alert("Cannot connect to server");
  }
}

// ---------- RESOLVE COMPLAINT ----------
async function resolveComplaint(complaintId) {
  if (!confirm("Mark this complaint as resolved?")) return;

  try {
    const response = await fetch(`${API_BASE}/complaints/${complaintId}/resolve`, {
      method: "PUT",
      headers: getAuthHeader()
    });

    if (response.ok) {
      alert("Complaint resolved successfully!");
      loadAllReports();
      updateOfficialKPIs();
    } else {
      alert("Failed to resolve complaint");
    }
  } catch (error) {
    alert("Cannot connect to server");
  }
}

// ---------- MAP ----------
let officialMap;

function initOfficialMap() {
  const lat = 13.0827;
  const lng = 80.2707;

  officialMap = L.map("officialMap").setView([lat, lng], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(officialMap);
}

function plotComplaintsOnMap(complaints) {
  if (!officialMap) return;

  complaints.forEach(c => {
    if (c.latitude && c.longitude) {
      L.marker([c.latitude, c.longitude])
        .addTo(officialMap)
        .bindPopup(`<strong>${c.title}</strong><br>Status: ${c.status}`);
    }
  });
}

// ---------- VIEW TOGGLE ----------
document.querySelectorAll("#viewToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#viewToggle button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const view = btn.dataset.view;
    document.getElementById("kanbanView").style.display =
      view === "kanban" ? "block" : "none";
    document.getElementById("tableView").style.display =
      view === "table" ? "block" : "none";
  });
});

// ---------- PROFILE + LOGOUT ----------
const profileBtn = document.getElementById("profileBtn");
if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    window.location.href = "official-profile.html";
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("ht_token");
    localStorage.removeItem("ht_current_user");
    window.location.href = "index.html";
  });
}

// ---------- LOAD NOTIFICATIONS ----------
async function loadNotifications() {
  try {
    const response = await fetch(`${API_BASE}/notifications/me`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const notifications = await response.json();
      const alertsDiv = document.getElementById("quickAlerts");
      if (!alertsDiv) return;

      if (notifications.length === 0) {
        alertsDiv.innerHTML = `<div class="small text-muted">No alerts</div>`;
        return;
      }

      alertsDiv.innerHTML = "";
      notifications.slice(0, 5).forEach(n => {
        alertsDiv.innerHTML += `
          <div class="alert alert-warning py-1 px-2 mb-1 small">
            <i class="bi bi-exclamation-triangle me-1"></i>
            ${n.message}
          </div>
        `;
      });
    }
  } catch (error) {
    console.error("Error loading notifications:", error);
  }
}