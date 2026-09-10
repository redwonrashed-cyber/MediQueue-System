/* ================================================================
   MediQueue - Doctor Schedule Module
   Doctors manage availability slots and view upcoming appointments.
================================================================ */

DB.seed();
const currentDoctor = requireRole("doctor");

function addSlot() {
  const date = document.getElementById("slotDate").value;
  const time = document.getElementById("slotTime").value;
  if (!date || !time) return alert("Please select date and time.");

  const slots = DB.load(DB.keys.DOCTOR_SLOTS);
  slots.push({
    id: Date.now(),
    doctorId: currentDoctor.id,
    doctorName: currentDoctor.name,
    date,
    time,
    available: true,
  });
  DB.save(DB.keys.DOCTOR_SLOTS, slots);
  renderSlots();
}

function renderSlots() {
  const tbody = document.querySelector("#slotTable tbody");
  const slots = DB.load(DB.keys.DOCTOR_SLOTS).filter(
    s => s.doctorId === currentDoctor.id
  );
  tbody.innerHTML = slots
    .map(
      s => `<tr><td>${s.date}</td><td>${s.time}</td>
        <td>${s.available ? "Available" : "Booked"}</td></tr>`
    )
    .join("");
}

function renderUpcomingAppointments() {
  const tbody = document.querySelector("#appointmentTable tbody");
  const appointments = DB.load(DB.keys.APPOINTMENTS).filter(
    a => a.doctorName === currentDoctor.name && a.status === "confirmed"
  );
  tbody.innerHTML = appointments
    .map(
      a => `<tr><td>${a.patientName}</td><td>${a.date}</td><td>${a.time}</td><td>${a.status}</td></tr>`
    )
    .join("");
}

renderSlots();
renderUpcomingAppointments();
