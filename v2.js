const serviceData = {
  pinturas: {
    title: "Pinturas",
    copy: "Interiores claros, renovacoes completas e acabamento uniforme para casas, apartamentos e espacos de uso diario.",
    image: "assets/client-photos/07.png",
    points: ["Interiores", "Exteriores", "Comercial"],
  },
  capoto: {
    title: "Capoto e isolamento",
    copy: "Capoto, barramentos e acabamento final em obra real, com foco na protecao exterior e numa leitura visual limpa.",
    image: "assets/client-photos/15.png",
    points: ["Capoto", "Barramentos", "Acabamento"],
  },
  fachadas: {
    title: "Fachadas e restauro",
    copy: "Fachadas, moradias e exteriores em renovacao, com detalhe de obra e presenca forte da marca no local.",
    image: "assets/client-photos/13.png",
    points: ["Fachadas", "Restauro", "Protecao"],
  },
  exterior: {
    title: "Exterior",
    copy: "Renovacao exterior com foco em moradias, volumes brancos, frentes limpas e consistencia no acabamento final.",
    image: "assets/client-photos/10.png",
    points: ["Moradias", "Obra nova", "Renovacao"],
  },
  decks: {
    title: "Decks e madeiras",
    copy: "Decks, passagens exteriores e zonas de piscina com um acabamento quente, cuidado e visualmente marcante.",
    image: "assets/client-photos/03.png",
    points: ["Decks", "Madeiras", "Manutencao"],
  },
  comercial: {
    title: "Comercial",
    copy: "Espacos comerciais, interiores de representacao e zonas tecnicas com pintura limpa e leitura contemporanea.",
    image: "assets/client-photos/08.png",
    points: ["Lojas", "Escritorios", "Hoteis"],
  },
};

const topbar = document.querySelector("[data-topbar]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const modal = document.querySelector("[data-modal]");
const floatingBudget = document.querySelector(".floating-budget");
const openBudgetButtons = document.querySelectorAll("[data-open-budget]");
const closeBudgetButtons = document.querySelectorAll("[data-close-budget]");
const splitTabs = document.querySelectorAll("[data-service-tab]");
const cardButtons = document.querySelectorAll("[data-service-card]");
const cardDetail = document.querySelector("[data-card-detail]");
const detailTitle = document.querySelector("[data-service-title]");
const detailCopy = document.querySelector("[data-service-copy]");
const detailImage = document.querySelector("[data-service-image]");
const detailPoints = document.querySelector("[data-service-points]");
const buildingToggle = document.querySelector("[data-building-toggle]");
const buildingToggleText = document.querySelector("[data-building-toggle-text]");
const buildingGallery = document.querySelector("[data-building-gallery]");

document.body.classList.add("enhanced");

const setTopbar = () => {
  topbar.classList.toggle("is-scrolled", window.scrollY > 24);
  floatingBudget.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
};

const closeNav = () => {
  nav.classList.remove("is-open");
  topbar.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const updateService = (key) => {
  const item = serviceData[key];

  if (!item || !detailTitle) {
    return;
  }

  detailTitle.textContent = item.title;
  detailCopy.textContent = item.copy;
  cardDetail?.classList.add("is-switching");
  detailImage.src = item.image;
  detailImage.alt = item.title;
  detailPoints.innerHTML = item.points.map((point) => `<span>${point}</span>`).join("");

  splitTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.serviceTab === key);
  });

  cardButtons.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.serviceCard === key);
  });

  window.setTimeout(() => {
    cardDetail?.classList.remove("is-switching");
  }, 180);
};

const openModal = () => {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeNav();
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

window.addEventListener("scroll", setTopbar, { passive: true });
setTopbar();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  topbar.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

splitTabs.forEach((tab) => {
  tab.addEventListener("click", () => updateService(tab.dataset.serviceTab));
});

cardButtons.forEach((card) => {
  card.addEventListener("click", () => {
    updateService(card.dataset.serviceCard);
    document.querySelector("[data-card-detail]")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  card.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(max-width: 560px)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--card-rotate-x", `${(-y * 6).toFixed(2)}deg`);
    card.style.setProperty("--card-rotate-y", `${(x * 7).toFixed(2)}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
  });
});

buildingToggle?.addEventListener("click", () => {
  const willOpen = buildingGallery.hidden;

  buildingGallery.hidden = !willOpen;
  buildingToggle.setAttribute("aria-expanded", String(willOpen));
  buildingToggleText.textContent = willOpen ? "Mostrar menos fotos" : "Ver galeria completa";
});

openBudgetButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeBudgetButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeNav();
  }
});

if (window.lucide) {
  window.lucide.createIcons();
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
