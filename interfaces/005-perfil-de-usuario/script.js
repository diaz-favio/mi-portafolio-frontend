const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const editProfileButton = document.getElementById("editProfileButton");
const editModal = document.getElementById("editModal");
const closeModalButton = document.getElementById("closeModalButton");
const cancelButton = document.getElementById("cancelButton");
const editProfileForm = document.getElementById("editProfileForm");
const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const emailInput = document.getElementById("emailInput");
const bioInput = document.getElementById("bioInput");
const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const profileBio = document.getElementById("profileBio");
const profileAvatar = document.getElementById("profileAvatar");
const topName = document.getElementById("topName");
const infoName = document.getElementById("infoName");
const infoEmail = document.getElementById("infoEmail");
const infoRole = document.getElementById("infoRole");

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeIcon.textContent = isLight ? "☀" : "☾";
  themeText.textContent = isLight ? "Modo oscuro" : "Modo claro";
  localStorage.setItem("profileTheme", isLight ? "light" : "dark");
});

const savedTheme = localStorage.getItem("profileTheme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeIcon.textContent = "☀";
  themeText.textContent = "Modo oscuro";
}

mobileMenuButton.addEventListener("click", () => {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
});

sidebarOverlay.addEventListener("click", closeSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
}

document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".menu-item").forEach((menuItem) => {
      menuItem.classList.remove("active");
    });
    item.classList.add("active");
    if (window.innerWidth <= 760) {
      closeSidebar();
    }
  });
});

editProfileButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);
document.querySelector(".modal-overlay").addEventListener("click", closeModal);

function openModal() {
  editModal.classList.add("open");
  editModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  editModal.classList.remove("open");
  editModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

editProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const role = roleInput.value.trim();
  const email = emailInput.value.trim();
  const bio = bioInput.value.trim();

  if (!name || !role || !email) return;

  profileName.textContent = name;
  profileRole.textContent = role;
  profileBio.textContent = bio;
  topName.textContent = name;
  infoName.textContent = name;
  infoEmail.textContent = email;
  infoRole.textContent = role;
  profileAvatar.textContent = createInitials(name);

  closeModal();
});

function createInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeSidebar();
  }
});