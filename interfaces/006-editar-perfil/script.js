const profileForm = document.getElementById("profileForm");
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".form-section");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const locationInput = document.getElementById("location");
const bio = document.getElementById("bio");
const jobTitle = document.getElementById("jobTitle");
const bioCounter = document.getElementById("bioCounter");
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const previewAvatar = document.getElementById("previewAvatar");
const removeAvatarButton = document.getElementById("removeAvatarButton");
const previewName = document.getElementById("previewName");
const previewRole = document.getElementById("previewRole");
const previewBio = document.getElementById("previewBio");
const previewLocation = document.getElementById("previewLocation");
const completionValue = document.getElementById("completionValue");
const completionBar = document.getElementById("completionBar");
const saveStatus = document.getElementById("saveStatus");
const resetButton = document.getElementById("resetButton");
const cancelChangesButton = document.getElementById("cancelChangesButton");
const headerSaveButton = document.getElementById("headerSaveButton");
const toast = document.getElementById("toast");

const initialValues = {
  firstName: firstName.value,
  lastName: lastName.value,
  email: email.value,
  location: locationInput.value,
  bio: bio.value,
  jobTitle: jobTitle.value
};

let avatarData = null;

navItems.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.section;
    navItems.forEach((item) => item.classList.remove("active"));
    sections.forEach((section) => section.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

function updateBioCounter() {
  bioCounter.textContent = `${bio.value.length}/240`;
}

bio.addEventListener("input", updateBioCounter);

function updatePreview() {
  const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`.trim();
  previewName.textContent = fullName || "Tu nombre";
  previewRole.textContent = jobTitle.value.trim() || "Tu especialidad";
  previewBio.textContent = bio.value.trim() || "Añade una descripción sobre ti.";
  previewLocation.textContent = locationInput.value.trim() || "Ubicación";

  if (!avatarData) {
    const initials = createInitials(fullName);
    avatarPreview.textContent = initials;
    previewAvatar.textContent = initials;
  }

  updateCompletion();
}

profileForm.addEventListener("input", () => {
  updatePreview();
  saveStatus.textContent = "Cambios sin guardar";
  saveStatus.classList.add("changed");
});

function updateCompletion() {
  const fields = [
    firstName.value,
    lastName.value,
    email.value,
    locationInput.value,
    bio.value,
    jobTitle.value
  ];
  const completed = fields.filter((value) => value.trim() !== "").length;
  const percentage = Math.round((completed / fields.length) * 100);
  completionValue.textContent = `${percentage}%`;
  completionBar.style.width = `${percentage}%`;
}

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast("La imagen supera los 5 MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    avatarData = reader.result;
    renderAvatarImage(avatarPreview, avatarData);
    renderAvatarImage(previewAvatar, avatarData);
    saveStatus.textContent = "Cambios sin guardar";
    saveStatus.classList.add("changed");
  };
  reader.readAsDataURL(file);
});

function renderAvatarImage(container, source) {
  container.innerHTML = "";
  const image = document.createElement("img");
  image.src = source;
  image.alt = "Foto de perfil";
  container.appendChild(image);
}

removeAvatarButton.addEventListener("click", () => {
  avatarData = null;
  avatarInput.value = "";
  const fullName = `${firstName.value} ${lastName.value}`;
  const initials = createInitials(fullName);
  avatarPreview.innerHTML = initials;
  previewAvatar.innerHTML = initials;
  saveStatus.textContent = "Cambios sin guardar";
  saveStatus.classList.add("changed");
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveProfile();
});

headerSaveButton.addEventListener("click", () => {
  profileForm.requestSubmit();
});

function saveProfile() {
  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim()) {
    showToast("Completa los campos obligatorios");
    return;
  }
  if (!isValidEmail(email.value)) {
    showToast("Ingresa un correo válido");
    return;
  }

  saveStatus.textContent = "Todos los cambios guardados";
  saveStatus.classList.remove("changed");
  showToast("Perfil actualizado correctamente");
}

resetButton.addEventListener("click", resetForm);
cancelChangesButton.addEventListener("click", resetForm);

function resetForm() {
  firstName.value = initialValues.firstName;
  lastName.value = initialValues.lastName;
  email.value = initialValues.email;
  locationInput.value = initialValues.location;
  bio.value = initialValues.bio;
  jobTitle.value = initialValues.jobTitle;
  avatarData = null;
  avatarInput.value = "";
  avatarPreview.innerHTML = "FD";
  previewAvatar.innerHTML = "FD";
  updateBioCounter();
  updatePreview();
  saveStatus.textContent = "Sin cambios pendientes";
  saveStatus.classList.remove("changed");
  showToast("Cambios restablecidos");
}

function createInitials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase() || "U";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

updateBioCounter();
updatePreview();