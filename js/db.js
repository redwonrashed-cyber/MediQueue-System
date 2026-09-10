/* ================================================================
   MediQueue - Shared Mock Database (localStorage based)
   Every module (auth, appointment, queue, doctor-schedule,
   patient-records, dashboard) reads/writes through this file.
================================================================ */

const DB_KEYS = {
  USERS: "mq_users",
  APPOINTMENTS: "mq_appointments",
  QUEUE: "mq_queue",
  DOCTOR_SLOTS: "mq_doctor_slots",
  PATIENT_RECORDS: "mq_patient_records",
};

function _load(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function _save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function seedDatabaseIfEmpty() {
  if (_load(DB_KEYS.USERS).length === 0) {
    _save(DB_KEYS.USERS, [
      { id: 1, name: "Admin User", email: "admin@mediqueue.com", password: "admin123", role: "admin" },
      { id: 2, name: "Dr. Ayesha Rahman", email: "ayesha@mediqueue.com", password: "doctor123", role: "doctor" },
      { id: 3, name: "Rina Khatun", email: "rina@mediqueue.com", password: "reception123", role: "receptionist" },
      { id: 4, name: "Karim Uddin", email: "karim@mediqueue.com", password: "patient123", role: "patient" },
    ]);
  }
  if (_load(DB_KEYS.DOCTOR_SLOTS).length === 0) {
    _save(DB_KEYS.DOCTOR_SLOTS, [
      { id: 1, doctorId: 2, doctorName: "Dr. Ayesha Rahman", date: "2026-09-15", time: "10:00 AM", available: true },
      { id: 2, doctorId: 2, doctorName: "Dr. Ayesha Rahman", date: "2026-09-15", time: "10:30 AM", available: true },
      { id: 3, doctorId: 2, doctorName: "Dr. Ayesha Rahman", date: "2026-09-15", time: "11:00 AM", available: true },
    ]);
  }
}

const DB = {
  keys: DB_KEYS,
  load: _load,
  save: _save,
  seed: seedDatabaseIfEmpty,
};
