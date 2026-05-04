const serviceData = {
  pinturas: {
    title: "Pinturas",
    copy: "Interiores e exteriores com preparação cuidada, acabamento uniforme e uma abordagem limpa para casas, prédios e espaços comerciais.",
    image: "assets/work-DXXm5PfDOgO.jpg",
    points: ["Interiores", "Exteriores", "Comercial"],
  },
  capoto: {
    title: "Capoto e isolamento",
    copy: "Soluções de isolamento térmico exterior com barramentos, preparação e acabamento final alinhado com o imóvel.",
    image: "assets/work-CsEur_0IxLc.jpg",
    points: ["Capoto", "Barramentos", "Acabamento"],
  },
  fachadas: {
    title: "Fachadas e restauro",
    copy: "Intervenções em fachadas, prédios antigos e moradias, com foco na recuperação da superfície antes da pintura.",
    image: "assets/work-CtzNfUeosX1.jpg",
    points: ["Fachadas", "Restauro", "Proteção"],
  },
  telhados: {
    title: "Telhados",
    copy: "Pintura e renovação visual de telhados e elementos exteriores sujeitos a sol, chuva e maresia.",
    image: "assets/work-CviFJpmIue0.jpg",
    points: ["Telhados", "Exterior", "Renovação"],
  },
  decks: {
    title: "Decks e madeiras",
    copy: "Tratamento e pintura de decks, madeiras exteriores e zonas de uso intenso, com acabamento resistente.",
    image: "assets/work-Cn4QuQetFvQ.jpg",
    points: ["Decks", "Madeiras", "Manutenção"],
  },
  comercial: {
    title: "Espaços comerciais",
    copy: "Pintura de lojas, escritórios, restaurantes e hotéis com planeamento para reduzir interrupções.",
    image: "assets/work-CuC6z60IKmb.jpg",
    points: ["Lojas", "Escritórios", "Hotéis"],
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
