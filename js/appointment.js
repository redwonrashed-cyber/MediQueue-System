/* ================================================================
   MediQueue - Appointment Booking Module
   Patients can book, reschedule and cancel appointments based on
   available doctor slots.
================================================================ */

DB.seed();
const currentPatient = requireRole("patient");

function renderAvailableSlots() {
  const select = document.getElementById("slotSelect");
  const slots = DB.load(DB.keys.DOCTOR_SLOTS).filter(s => s.available);
  select.innerHTML = slots
    .map(s => `<option value="${s.id}">${s.doctorName} - ${s.date} ${s.time}</option>`)
    .join("");
}

function bookAppointment() {
  const slotId = parseInt(document.getElementById("slotSelect").value);
  const slots = DB.load(DB.keys.DOCTOR_SLOTS);
  const slot = slots.find(s => s.id === slotId);
  if (!slot) return alert("Please select a valid slot.");

  // mark slot as booked
  slot.available = false;
  DB.save(DB.keys.DOCTOR_SLOTS, slots);

  // create appointment record
  const appointments = DB.load(DB.keys.APPOINTMENTS);
  const newAppointment = {
    id: Date.now(),
    patientId: currentPatient.id,
    patientName: currentPatient.name,
    doctorName: slot.doctorName,
    date: slot.date,
    time: slot.time,
    status: "confirmed",
  };
  appointments.push(newAppointment);
  DB.save(DB.keys.APPOINTMENTS, appointments);

  // auto-generate a queue token for this appointment (feeds queue module)
  const queue = DB.load(DB.keys.QUEUE);
  queue.push({
    id: Date.now() + 1,
    appointmentId: newAppointment.id,
    patientName: currentPatient.name,
    token: "T" + String(queue.length + 1).padStart(3, "0"),
    status: "waiting",
  });
  DB.save(DB.keys.QUEUE, queue);

  renderAvailableSlots();
  renderMyAppointments();
}

function cancelAppointment(appointmentId) {
  let appointments = DB.load(DB.keys.APPOINTMENTS);
  appointments = appointments.map(a =>
    a.id === appointmentId ? { ...a, status: "cancelled" } : a
  );
  DB.save(DB.keys.APPOINTMENTS, appointments);
  renderMyAppointments();
}

function renderMyAppointments() {
  const tbody = document.querySelector("#appointmentTable tbody");
  const appointments = DB.load(DB.keys.APPOINTMENTS).filter(
    a => a.patientId === currentPatient.id
  );

  tbody.innerHTML = appointments
    .map(
      a => `<tr>
        <td>${a.doctorName}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>${a.status}</td>
        <td>${
          a.status === "confirmed"
            ? `<button style="width:auto;" onclick="cancelAppointment(${a.id})">Cancel</button>`
            : "-"
        }</td>
      </tr>`
    )
    .join("");
}

renderAvailableSlots();
renderMyAppointments();
