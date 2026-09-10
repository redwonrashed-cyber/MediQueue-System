/* ================================================================
   MediQueue - Patient Records Module
   Maintains digital patient records (name, diagnosis/notes, date).
================================================================ */

DB.seed();
const currentUser = getCurrentUser();
if (!currentUser || (currentUser.role !== "receptionist" && currentUser.role !== "admin")) {
  alert("Access restricted to receptionist/admin.");
  window.location.href = "../index.html";
}

function saveRecord() {
  const name = document.getElementById("patientName").value.trim();
  const diagnosis = document.getElementById("diagnosis").value.trim();
  if (!name || !diagnosis) return alert("Please fill in both fields.");

  const records = DB.load(DB.keys.PATIENT_RECORDS);
  records.push({
    id: Date.now(),
    patientName: name,
    diagnosis,
    date: new Date().toISOString().split("T")[0],
  });
  DB.save(DB.keys.PATIENT_RECORDS, records);

  document.getElementById("patientName").value = "";
  document.getElementById("diagnosis").value = "";
  renderRecords();
}

function renderRecords() {
  const tbody = document.querySelector("#recordTable tbody");
  const records = DB.load(DB.keys.PATIENT_RECORDS);
  tbody.innerHTML = records
    .map(
      r => `<tr><td>${r.patientName}</td><td>${r.diagnosis}</td><td>${r.date}</td></tr>`
    )
    .join("");
}

renderRecords();
