/* ================================================================
   MediQueue - Admin Dashboard & Reports Module
   Aggregates statistics from all other modules for monitoring.
================================================================ */

DB.seed();
requireRole("admin");

function renderStats() {
  const appointments = DB.load(DB.keys.APPOINTMENTS);
  const queue = DB.load(DB.keys.QUEUE);
  const doctors = DB.load(DB.keys.USERS).filter(u => u.role === "doctor");
  const records = DB.load(DB.keys.PATIENT_RECORDS);

  document.getElementById("statAppointments").textContent = appointments.length;
  document.getElementById("statQueue").textContent = queue.filter(
    q => q.status !== "done"
  ).length;
  document.getElementById("statDoctors").textContent = doctors.length;
  document.getElementById("statRecords").textContent = records.length;

  const breakdown = {};
  queue.forEach(q => (breakdown[q.status] = (breakdown[q.status] || 0) + 1));

  const tbody = document.querySelector("#queueStatusTable tbody");
  tbody.innerHTML = Object.entries(breakdown)
    .map(([status, count]) => `<tr><td>${status}</td><td>${count}</td></tr>`)
    .join("");
}

renderStats();
