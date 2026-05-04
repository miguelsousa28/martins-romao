const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const modal = document.querySelector("[data-modal]");
const floatingBudget = document.querySelector(".floating-budget");
const openBudgetButtons = document.querySelectorAll("[data-open-budget]");
const closeBudgetButtons = document.querySelectorAll("[data-close-budget]");
const accordion = document.querySelector("[data-accordion]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
  floatingBudget.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.55);
};

const closeNav = () => {
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
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

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
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

accordion.querySelectorAll(".service-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".service-item");
    const isOpen = item.classList.contains("is-open");

    accordion.querySelectorAll(".service-item").forEach((service) => {
      service.classList.remove("is-open");
      service.querySelector(".service-trigger").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

if (window.lucide) {
  window.lucide.createIcons();
}
