// js/notifications.js



async function loadNotificationBell() {
  try {
    // Get unread count
    const countResponse = await fetch(`${API_BASE}/notifications/unread-count`, {
      headers: getAuthHeader()
    });

    if (countResponse.ok) {
      const count = await countResponse.json();
      const bellCount = document.getElementById("bellCount");
      if (bellCount) {
        if (count > 0) {
          bellCount.textContent = count;
          bellCount.style.display = "block";
        } else {
          bellCount.style.display = "none";
        }
      }
    }

    // Get all notifications
    const response = await fetch(`${API_BASE}/notifications/me`, {
      headers: getAuthHeader()
    });

    if (response.ok) {
      const notifications = await response.json();
      const list = document.getElementById("notificationList");
      if (!list) return;

      if (notifications.length === 0) {
        list.innerHTML = `<div class="px-3 py-2 text-muted small">No notifications</div>`;
        return;
      }

      list.innerHTML = "";
      notifications.forEach(n => {
        const isRead = n.isRead;
        list.innerHTML += `
          <li>
            <div class="px-3 py-2 border-bottom ${isRead ? "" : "bg-light"}" 
              style="cursor:pointer;" onclick="markAsRead(${n.id}, this)">
              <div class="small fw-semibold ${isRead ? "text-muted" : "text-dark"}">
                ${n.message}
              </div>
              <div class="text-muted" style="font-size:0.75rem;">
                ${new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </li>
        `;
      });
    }
  } catch (error) {
    console.error("Error loading notifications:", error);
  }
}

async function markAsRead(notificationId, element) {
  try {
    await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: getAuthHeader()
    });

    // Update UI
    element.classList.remove("bg-light");
    element.querySelector(".fw-semibold").classList.add("text-muted");
    element.querySelector(".fw-semibold").classList.remove("text-dark");

    // Refresh bell count
    loadNotificationBell();
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

// Auto refresh every 30 seconds
setInterval(loadNotificationBell, 30000);