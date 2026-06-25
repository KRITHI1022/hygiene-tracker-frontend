const user = JSON.parse(localStorage.getItem("loggedInUser"));
const logoutBtn = document.getElementById("logoutBtn");
const backBtn = document.getElementById("backBtn");
const profileForm = document.getElementById("profileForm");
const saveMsg = document.getElementById("saveMsg");
const photoUpload = document.getElementById("photoUpload");
const profileImage = document.getElementById("profileImage");

if (!user) {
  window.location.href = "index.html";
}



// Load user info
document.getElementById("name").value = user.name || "";
document.getElementById("email").value = user.email || "";
document.getElementById("userType").value = user.userType || "";

const profileData = JSON.parse(localStorage.getItem(`${user.email}_profile`)) || {};
document.getElementById("aadhar").value = profileData.aadhar || "";
document.getElementById("age").value = profileData.age || "";
document.getElementById("state").value = profileData.state || "";
document.getElementById("district").value = profileData.district || "";
document.getElementById("area").value = profileData.area || "";
document.getElementById("municipalOffice").value = profileData.municipalOffice || "";
if (profileData.photo) profileImage.src = profileData.photo;

// Save changes
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const updatedProfile = {
    aadhar: document.getElementById("aadhar").value.trim(),
    age: document.getElementById("age").value.trim(),
    state: document.getElementById("state").value.trim(),
    district: document.getElementById("district").value.trim(),
    area: document.getElementById("area").value.trim(),
    municipalOffice: document.getElementById("municipalOffice").value.trim(),
    photo: profileImage.src,
  };

  localStorage.setItem(`${user.email}_profile`, JSON.stringify(updatedProfile));
  saveMsg.textContent = "Profile saved successfully!";
  saveMsg.style.color = "#2b7a78";
});

// Upload photo
photoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// inside profile.js
document.addEventListener("DOMContentLoaded", () => {
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const photoInput = document.getElementById("photoInput");

  saveProfileBtn.addEventListener("click", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        loggedInUser.photo = e.target.result; // base64 string
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        alert("Profile updated!");
      };
      reader.readAsDataURL(photoInput.files[0]);
    }
  });
});

// Navigation
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

backBtn.addEventListener("click", () => {
  if (user.userType === "citizen") {
    window.location.href = "citizen-dashboard.html";
  } else {
    window.location.href = "official-dashboard.html";
  }
});
