const ITEMS_PER_PAGE = 24;

let interfaces = [];
let filteredInterfaces = [];
let currentPage = 1;
let currentCategory = "Todas";
let currentStatus = "Todos";

const interfacesGrid = document.getElementById("interfacesGrid");
const searchInput = document.getElementById("searchInput");
const filtersContainer = document.getElementById("filters");
const statusFiltersContainer = document.getElementById("statusFilters");
const pagination = document.getElementById("pagination");
const totalInterfaces = document.getElementById("totalInterfaces");
const readyInterfaces = document.getElementById("readyInterfaces");
const pendingInterfaces = document.getElementById("pendingInterfaces");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");

const TECHNOLOGIES = {
  HTML5: {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
  },
  CSS3: {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
  },
  JavaScript: {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
  }
};

async function loadInterfaces() {
  try {
    const response = await fetch("data/interfaces.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("interfaces.json debe contener un array.");
    }
    interfaces = data;
    filteredInterfaces = [...interfaces];
    updateCatalogStats();
    generateFilters();
    applyFilters();
  } catch (error) {
    console.error("Error cargando interfaces:", error);
    interfacesGrid.innerHTML = `
      <div class="error-message">
        <h3>No se pudieron cargar las interfaces</h3>
        <p>Revisa <strong>data/interfaces.json</strong> y ejecuta la página mediante Live Server.</p>
      </div>
    `;
    totalInterfaces.textContent = "0";
    readyInterfaces.textContent = "0";
    pendingInterfaces.textContent = "0";
    resultsCount.textContent = "0 resultados";
  }
}

function updateCatalogStats() {
  const total = interfaces.length;
  const ready = interfaces.filter((item) => item.status === "ready").length;
  const pending = interfaces.filter((item) => item.status === "pending").length;
  totalInterfaces.textContent = total;
  readyInterfaces.textContent = ready;
  pendingInterfaces.textContent = pending;
}

function generateFilters() {
  const categories = [
    ...new Set(interfaces.map((item) => item.category).filter(Boolean))
  ];
  categories.sort((a, b) => a.localeCompare(b, "es"));
  filtersContainer.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "filter-btn active";
  allButton.dataset.category = "Todas";
  allButton.textContent = "Todas";
  filtersContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn";
    button.dataset.category = category;
    button.textContent = category;
    filtersContainer.appendChild(button);
  });
}

searchInput.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});

filtersContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;
  filtersContainer.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
  currentCategory = button.dataset.category;
  currentPage = 1;
  applyFilters();
});

statusFiltersContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".status-filter-btn");
  if (!button) return;
  statusFiltersContainer.querySelectorAll(".status-filter-btn").forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
  currentStatus = button.dataset.status;
  currentPage = 1;
  applyFilters();
});

function applyFilters() {
  const search = normalizeText(searchInput.value);
  filteredInterfaces = interfaces.filter((item) => {
    const searchableText = normalizeText(
      `${item.id || ""} ${item.name || ""} ${item.category || ""} ${item.description || ""}`
    );
    const matchesSearch = searchableText.includes(search);
    const matchesCategory = currentCategory === "Todas" || item.category === currentCategory;
    const matchesStatus = currentStatus === "Todos" || item.status === currentStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  currentPage = 1;
  renderInterfaces();
}

function renderInterfaces() {
  interfacesGrid.innerHTML = "";
  resultsCount.textContent = `${filteredInterfaces.length} ${filteredInterfaces.length === 1 ? "resultado" : "resultados"}`;

  if (filteredInterfaces.length === 0) {
    emptyState.hidden = false;
    pagination.innerHTML = "";
    return;
  }

  emptyState.hidden = true;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = filteredInterfaces.slice(start, end);

  pageItems.forEach((item) => {
    const card = createInterfaceCard(item);
    interfacesGrid.appendChild(card);
  });

  renderPagination();
}

function createInterfaceCard(item) {
  const card = document.createElement("article");
  card.className = "interface-card";
  const number = String(item.id).padStart(3, "0");
  const isReady = item.status === "ready";
  const description = item.description || `Plantilla frontend responsive de ${item.name}, desarrollada con HTML5, CSS3 y JavaScript.`;
  const technologies = Array.isArray(item.technologies) ? item.technologies : ["HTML5", "CSS3", "JavaScript"];

  card.innerHTML = `
    <div class="card-content">
      <div class="card-top">
        <span class="card-number">#${escapeHTML(number)}</span>
        <span class="card-category">${escapeHTML(item.category || "Frontend")}</span>
      </div>
      <h3>${escapeHTML(item.name || "Interfaz Frontend")}</h3>
      <p class="card-description">${escapeHTML(description)}</p>
      <div class="technologies">${createTechnologiesHTML(technologies)}</div>
      <div class="card-status">
        ${isReady
          ? `<span class="status-ready">Disponible</span>`
          : `<span class="status-pending">Próximamente</span>`
        }
      </div>
      <div class="card-actions">
        ${isReady
          ? `<a href="${escapeAttribute(item.demo || "#")}" class="demo-btn" target="_blank" rel="noopener noreferrer">Ver interfaz <span>→</span></a>`
          : `<button type="button" class="demo-btn disabled" disabled>Próximamente</button>`
        }
      </div>
    </div>
  `;

  return card;
}

function createTechnologiesHTML(technologyList) {
  return technologyList.map((technologyName) => {
    const technology = TECHNOLOGIES[technologyName];
    if (technology) {
      return `
        <div class="technology">
          <img src="${technology.icon}" alt="${escapeAttribute(technology.name)}" loading="lazy">
          <span>${escapeHTML(technology.name)}</span>
        </div>
      `;
    }
    return `
      <div class="technology">
        <span>${escapeHTML(technologyName)}</span>
      </div>
    `;
  }).join("");
}

function normalizeText(text) {
  return String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredInterfaces.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.textContent = "← Anterior";
  previousButton.disabled = currentPage === 1;
  previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderInterfaces();
      scrollToCatalog();
    }
  });
  pagination.appendChild(previousButton);

  const pages = getVisiblePages(currentPage, totalPages);
  pages.forEach((page) => {
    if (page === "...") {
      const dots = document.createElement("span");
      dots.className = "pagination-dots";
      dots.textContent = "...";
      pagination.appendChild(dots);
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = page;
    if (page === currentPage) {
      button.classList.add("active");
      button.setAttribute("aria-current", "page");
    }
    button.addEventListener("click", () => {
      currentPage = page;
      renderInterfaces();
      scrollToCatalog();
    });
    pagination.appendChild(button);
  });

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "Siguiente →";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderInterfaces();
      scrollToCatalog();
    }
  });
  pagination.appendChild(nextButton);
}

function getVisiblePages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function scrollToCatalog() {
  const catalog = document.getElementById("interfaces");
  if (!catalog) return;
  catalog.scrollIntoView({ behavior: "smooth", block: "start" });
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

loadInterfaces();