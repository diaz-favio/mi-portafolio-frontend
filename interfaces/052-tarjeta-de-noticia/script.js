const news = [
  {
    id: 1,
    title: "La inteligencia artificial transforma la forma de crear productos digitales",
    category: "Tecnología",
    description: "Nuevas herramientas están cambiando la manera en que diseñadores y desarrolladores construyen experiencias digitales.",
    author: "Laura Méndez",
    initials: "LM",
    date: "05 Sep 2026",
    readTime: "5 min",
    image: "image-tech",
    symbol: "AI"
  },
  {
    id: 2,
    title: "Las startups tecnológicas redefinen los modelos de negocio tradicionales",
    category: "Negocios",
    description: "Empresas emergentes están utilizando automatización y plataformas digitales para competir en mercados cada vez más dinámicos.",
    author: "Carlos Ruiz",
    initials: "CR",
    date: "04 Sep 2026",
    readTime: "4 min",
    image: "image-business",
    symbol: "↑"
  },
  {
    id: 3,
    title: "Interfaces simples: por qué el diseño minimalista continúa creciendo",
    category: "Diseño",
    description: "La claridad visual y la reducción de elementos innecesarios siguen siendo claves para mejorar la experiencia de usuario.",
    author: "Ana Torres",
    initials: "AT",
    date: "03 Sep 2026",
    readTime: "6 min",
    image: "image-design",
    symbol: "UI"
  },
  {
    id: 4,
    title: "Automatización inteligente: el nuevo aliado de los profesionales digitales",
    category: "Tecnología",
    description: "La automatización permite reducir tareas repetitivas y dedicar más tiempo al análisis, creatividad y toma de decisiones.",
    author: "Diego López",
    initials: "DL",
    date: "02 Sep 2026",
    readTime: "7 min",
    image: "image-ai",
    symbol: "01"
  },
  {
    id: 5,
    title: "El diseño responsive evoluciona más allá de celulares y computadoras",
    category: "Diseño",
    description: "Las nuevas experiencias digitales deben adaptarse a una variedad creciente de pantallas, dispositivos y formas de interacción.",
    author: "María Silva",
    initials: "MS",
    date: "01 Sep 2026",
    readTime: "5 min",
    image: "image-cyan",
    symbol: "RWD"
  },
  {
    id: 6,
    title: "La experiencia digital se convierte en una ventaja competitiva",
    category: "Negocios",
    description: "Las organizaciones están priorizando productos digitales rápidos, accesibles y fáciles de utilizar para mejorar la relación con sus clientes.",
    author: "Jorge Ramos",
    initials: "JR",
    date: "31 Ago 2026",
    readTime: "4 min",
    image: "image-dark",
    symbol: "UX"
  }
];

let currentCategory = "Todas";
let favoriteNews = new Set();

const newsGrid = document.getElementById("newsGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const categoryButtons = document.querySelectorAll(".nav-category");
const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelector(".nav-links");

const newsModal = document.getElementById("newsModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalDate = document.getElementById("modalDate");
const modalDescription = document.getElementById("modalDescription");
const shareModalButton = document.getElementById("shareModalButton");
const closeArticleButton = document.getElementById("closeArticleButton");
const toast = document.getElementById("toast");

function renderNews() {
  const search = normalizeText(searchInput.value);
  const filtered = news.filter((item) => {
    const matchesCategory = currentCategory === "Todas" || item.category === currentCategory;
    const searchableText = normalizeText(`${item.title} ${item.description} ${item.category} ${item.author}`);
    const matchesSearch = searchableText.includes(search);
    return matchesCategory && matchesSearch;
  });

  newsGrid.innerHTML = "";
  resultCount.textContent = filtered.length;

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  filtered.forEach((item) => {
    const card = createNewsCard(item);
    newsGrid.appendChild(card);
  });
}

function createNewsCard(item) {
  const article = document.createElement("article");
  article.className = "news-card";
  const isFavorite = favoriteNews.has(item.id);

  article.innerHTML = `
    <div class="news-image ${item.image}">
      <span class="news-category">${escapeHTML(item.category)}</span>
      <button type="button" class="favorite-button ${isFavorite ? "active" : ""}" data-favorite="${item.id}" aria-label="Guardar noticia">
        ${isFavorite ? "♥" : "♡"}
      </button>
      <span class="image-symbol">${escapeHTML(item.symbol)}</span>
    </div>
    <div class="news-content">
      <div class="news-meta">
        <span>${escapeHTML(item.date)}</span>
        <span>•</span>
        <span>${escapeHTML(item.readTime)}</span>
      </div>
      <h2>${escapeHTML(item.title)}</h2>
      <p class="news-description">${escapeHTML(item.description)}</p>
      <div class="news-footer">
        <div class="author-avatar">${escapeHTML(item.initials)}</div>
        <div class="author-info">
          <strong>${escapeHTML(item.author)}</strong>
          <span>Autor</span>
        </div>
        <button type="button" class="read-button" data-read="${item.id}">Leer →</button>
      </div>
    </div>
  `;

  return article;
}

searchInput.addEventListener("input", renderNews);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderNews();
    navLinks.classList.remove("open");
  });
});

newsGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    toggleFavorite(id);
    return;
  }

  const readButton = event.target.closest("[data-read]");
  if (readButton) {
    const id = Number(readButton.dataset.read);
    openArticle(id);
  }
});

function toggleFavorite(id) {
  if (favoriteNews.has(id)) {
    favoriteNews.delete(id);
    showToast("Eliminado de favoritos");
  } else {
    favoriteNews.add(id);
    showToast("Guardado en favoritos");
  }
  renderNews();
}

function openArticle(id) {
  const item = news.find((newsItem) => newsItem.id === id);
  if (!item) return;

  modalImage.className = `modal-image ${item.image}`;
  modalCategory.textContent = item.category;
  modalTitle.textContent = item.title;
  modalAuthor.textContent = item.author;
  modalDate.textContent = item.date;
  modalDescription.textContent = `${item.description} Esta vista representa el detalle de una noticia dentro de una interfaz frontend. En una aplicación real, este contenido podría provenir de una API, CMS o base de datos.`;

  newsModal.classList.add("open");
  newsModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  newsModal.classList.remove("open");
  newsModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
closeArticleButton.addEventListener("click", closeModal);

shareModalButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Enlace copiado");
  } catch {
    showToast("No se pudo copiar");
  }
});

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    navLinks.classList.remove("open");
  }
});

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

renderNews();