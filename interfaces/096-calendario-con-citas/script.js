let appointments = [
  { id: 1, name: "María Torres", service: "Consulta", date: "2026-09-05", time: "09:30", status: "confirmed", notes: "Primera consulta." },
  { id: 2, name: "Carlos Mendoza", service: "Asesoría", date: "2026-09-05", time: "11:00", status: "pending", notes: "Revisión de propuesta." },
  { id: 3, name: "Ana Ramírez", service: "Seguimiento", date: "2026-09-05", time: "15:30", status: "confirmed", notes: "" },
  { id: 4, name: "Jorge Silva", service: "Reunión", date: "2026-09-08", time: "10:00", status: "confirmed", notes: "" },
  { id: 5, name: "Lucía Castro", service: "Consulta", date: "2026-09-12", time: "16:00", status: "pending", notes: "" }
];

let currentDate = new Date(2026, 8, 5);
let selectedDate = new Date(2026, 8, 5);
let currentStatus = "all";

const calendarGrid = document.getElementById("calendarGrid");
const currentMonth = document.getElementById("currentMonth");
const selectedDateTitle = document.getElementById("selectedDateTitle");
const appointmentsList = document.getElementById("appointmentsList");
const appointmentCount = document.getElementById("appointmentCount");
const emptyState = document.getElementById("emptyState");
const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");
const statusFilters = document.querySelectorAll(".status-filter");

const appointmentModal = document.getElementById("appointmentModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");
const appointmentForm = document.getElementById("appointmentForm");
const newAppointmentButton = document.getElementById("newAppointmentButton");
const emptyNewAppointment = document.getElementById("emptyNewAppointment");
const clientName = document.getElementById("clientName");
const service = document.getElementById("service");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");
const appointmentStatus = document.getElementById("appointmentStatus");
const notes = document.getElementById("notes");
const toast = document.getElementById("toast");

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function renderCalendar() {
  calendarGrid.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  currentMonth.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  let startingDay = firstDay.getDay();
  startingDay = startingDay === 0 ? 6 : startingDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();
  const totalCells = 42;

  for (let index = 0; index < totalCells; index++) {
    let day;
    let cellDate;
    let otherMonth = false;

    if (index < startingDay) {
      day = previousMonthDays - startingDay + index + 1;
      cellDate = new Date(year, month - 1, day);
      otherMonth = true;
    } else if (index >= startingDay + daysInMonth) {
      day = index - startingDay - daysInMonth + 1;
      cellDate = new Date(year, month + 1, day);
      otherMonth = true;
    } else {
      day = index - startingDay + 1;
      cellDate = new Date(year, month, day);
    }

    const element = createDayElement(cellDate, day, otherMonth);
    calendarGrid.appendChild(element);
  }
}

function createDayElement(date, day, otherMonth) {
  const element = document.createElement("div");
  element.className = "calendar-day";
  if (otherMonth) element.classList.add("other-month");
  if (sameDate(date, selectedDate)) element.classList.add("selected");

  const today = new Date();
  if (sameDate(date, today)) element.classList.add("today");

  const dateKey = formatDateKey(date);
  const dayAppointments = appointments.filter((item) => item.date === dateKey);

  const eventsHTML = dayAppointments.slice(0, 2).map((item) => `
    <div class="day-event ${item.status === "pending" ? "pending" : ""}">
      ${escapeHTML(item.time)} ${escapeHTML(item.name)}
    </div>
  `).join("");

  const extraCount = dayAppointments.length - 2;

  element.innerHTML = `
    <span class="day-number">${day}</span>
    <div class="day-events">
      ${eventsHTML}
      ${extraCount > 0 ? `<span class="more-events">+${extraCount} más</span>` : ""}
    </div>
  `;

  element.addEventListener("click", () => {
    selectedDate = new Date(date);
    if (date.getMonth() !== currentDate.getMonth()) {
      currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    renderCalendar();
    renderAppointments();
  });

  return element;
}

function renderAppointments() {
  const dateKey = formatDateKey(selectedDate);
  selectedDateTitle.textContent = formatHumanDate(selectedDate);

  let dayAppointments = appointments.filter((item) => item.date === dateKey);

  if (currentStatus !== "all") {
    dayAppointments = dayAppointments.filter((item) => item.status === currentStatus);
  }

  dayAppointments.sort((a, b) => a.time.localeCompare(b.time));

  appointmentCount.textContent = `${dayAppointments.length} ${dayAppointments.length === 1 ? "cita" : "citas"}`;
  appointmentsList.innerHTML = "";

  if (dayAppointments.length === 0) {
    emptyState.hidden = false;
    appointmentsList.style.display = "none";
    return;
  }

  emptyState.hidden = true;
  appointmentsList.style.display = "block";

  dayAppointments.forEach((item) => {
    const card = document.createElement("article");
    card.className = "appointment-card";
    card.innerHTML = `
      <div class="appointment-time">${escapeHTML(item.time)}</div>
      <div class="appointment-info">
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.service)}</p>
        <button type="button" class="delete-appointment" data-delete="${item.id}">Eliminar</button>
      </div>
      <span class="appointment-status ${item.status === "pending" ? "pending" : ""}"></span>
    `;
    appointmentsList.appendChild(card);
  });
}

statusFilters.forEach((button) => {
  button.addEventListener("click", () => {
    statusFilters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentStatus = button.dataset.status;
    renderAppointments();
  });
});

previousMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar();
});

todayButton.addEventListener("click", () => {
  const today = new Date();
  currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate = new Date(today);
  renderCalendar();
  renderAppointments();
});

newAppointmentButton.addEventListener("click", openModal);
emptyNewAppointment.addEventListener("click", openModal);

function openModal() {
  appointmentDate.value = formatDateKey(selectedDate);
  appointmentModal.classList.add("open");
  appointmentModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => clientName.focus(), 100);
}

function closeAppointmentModal() {
  appointmentModal.classList.remove("open");
  appointmentModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalOverlay.addEventListener("click", closeAppointmentModal);
closeModalButton.addEventListener("click", closeAppointmentModal);
cancelButton.addEventListener("click", closeAppointmentModal);

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const appointment = {
    id: Date.now(),
    name: clientName.value.trim(),
    service: service.value,
    date: appointmentDate.value,
    time: appointmentTime.value,
    status: appointmentStatus.value,
    notes: notes.value.trim()
  };

  appointments.push(appointment);
  selectedDate = parseDateKey(appointment.date);
  currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

  appointmentForm.reset();
  closeAppointmentModal();
  renderCalendar();
  renderAppointments();
  showToast("Cita guardada correctamente");
});

appointmentsList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  if (!deleteButton) return;

  const id = Number(deleteButton.dataset.delete);
  appointments = appointments.filter((item) => item.id !== id);
  renderCalendar();
  renderAppointments();
  showToast("Cita eliminada");
});

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function sameDate(first, second) {
  return first.getFullYear() === second.getFullYear() &&
         first.getMonth() === second.getMonth() &&
         first.getDate() === second.getDate();
}

function formatHumanDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date).replace(/^\w/, (letter) => letter.toUpperCase());
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAppointmentModal();
});

renderCalendar();
renderAppointments();