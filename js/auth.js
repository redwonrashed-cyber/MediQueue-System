/* ================================================================
   MediQueue - Authentication Module
   Handles login, role-based redirection, session and logout.
================================================================ */

DB.seed();

function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error");

  const users = DB.load(DB.keys.USERS);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errorBox.textContent = "Invalid email or password.";
    return;
  }

  // store session
  sessionStorage.setItem("mq_current_user", JSON.stringify(user));

  // role-based redirect
  switch (user.role) {
    case "admin":
      window.location.href = "pages/admin-dashboard.html";
      break;
    case "doctor":
      window.location.href = "pages/doctor-schedule.html";
      break;
    case "receptionist":
      window.location.href = "pages/receptionist-queue.html";
      break;
    case "patient":
      window.location.href = "pages/patient-appointment.html";
      break;
    default:
      errorBox.textContent = "Unknown role.";
  }
}

function getCurrentUser() {
  const raw = sessionStorage.getItem("mq_current_user");
  return raw ? JSON.parse(raw) : null;
}

function requireRole(expectedRole) {
  const user = getCurrentUser();
  if (!user || user.role !== expectedRole) {
    alert("Please log in as " + expectedRole + " to view this page.");
    window.location.href = "../index.html";
  }
  return user;
}

function logout() {
  sessionStorage.removeItem("mq_current_user");
  window.location.href = "../index.html";
}
