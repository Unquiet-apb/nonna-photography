const translations = {
  de: {
    skip: "Zum Inhalt springen",
    navWork: "Arbeiten",
    navAbout: "Über mich",
    navContact: "Kontakt",
    heroLocation: "Waren, Deutschland · europaweit",
    heroLineOne: "Fashion",
    heroLineTwo: "Photographer",
    heroIntro: "Editorials, Model Tests und Portraits mit Ruhe, Präsenz und einem klaren Blick für Persönlichkeit.",
    viewWork: "Ausgewählte Arbeiten ansehen",
    scroll: "Scrollen, um zu entdecken",
    since: "Fotografie seit 2012 · Fashion seit 2019",
    statement: "Bilder, die Haltung zeigen und Raum für Persönlichkeit lassen.",
    selectedWork: "Ausgewählte Arbeiten",
    workIntro: "Fashion, Model Tests und Portraits",
    aboutNote: "Über Nonna",
    aboutTitle: "Ein präziser Blick. Eine ruhige Atmosphäre. Bilder mit Charakter.",
    aboutBody: "Nonna Hevorhian arbeitet seit 2012 als Fotografin und konzentriert sich seit 2019 auf Fashion Photography. Von Waren aus begleitet sie Produktionen in ganz Deutschland und europaweit. Ihre Arbeit verbindet klare Bildgestaltung mit einem aufmerksamen Blick für Ausdruck und Individualität.",
    experiencePhoto: "Beginn der fotografischen Arbeit",
    experienceFashion: "Fokus auf Fashion Photography",
    europe: "Europa",
    experienceTravel: "Verfügbar für Produktionen auf Anfrage",
    contactNote: "Neue Produktionen",
    contactTitle: "Erzählen Sie mir von Ihrem nächsten Projekt.",
    contactLocation: "Waren, Deutschland",
    contactTravel: "Europaweit verfügbar",
    backTop: "Nach oben",
  },
  en: {
    skip: "Skip to content",
    navWork: "Work",
    navAbout: "About",
    navContact: "Contact",
    heroLocation: "Waren, Germany · available across Europe",
    heroLineOne: "Fashion",
    heroLineTwo: "Photographer",
    heroIntro: "Editorials, model tests and portraits shaped by calm direction, presence and a clear eye for personality.",
    viewWork: "View selected work",
    scroll: "Scroll to discover",
    since: "Photography since 2012 · fashion since 2019",
    statement: "Images with a point of view and room for personality.",
    selectedWork: "Selected work",
    workIntro: "Fashion, model tests and portraits",
    aboutNote: "About Nonna",
    aboutTitle: "A precise eye. A quiet atmosphere. Images with character.",
    aboutBody: "Nonna Hevorhian has worked as a photographer since 2012 and has focused on fashion photography since 2019. Based in Waren, she works on productions throughout Germany and across Europe. Her images combine clear composition with close attention to expression and individuality.",
    experiencePhoto: "Began working in photography",
    experienceFashion: "Focused on fashion photography",
    europe: "Europe",
    experienceTravel: "Available for productions on request",
    contactNote: "New productions",
    contactTitle: "Tell me about your next project.",
    contactLocation: "Waren, Germany",
    contactTravel: "Available across Europe",
    backTop: "Back to top",
  },
};

const languageButtons = document.querySelectorAll("[data-lang]");

function setLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.textContent = translations[language][key];
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem("nonna-language", language);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.lang;
    setLanguage(language);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    history.replaceState({}, "", url);
  });
});

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
const savedLanguage = localStorage.getItem("nonna-language");
const browserLanguage = navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
setLanguage(["de", "en"].includes(requestedLanguage) ? requestedLanguage : savedLanguage || browserLanguage);

document.getElementById("year").textContent = new Date().getFullYear();

const siteHeader = document.querySelector(".site-header");
let headerUpdateQueued = false;

function updateHeaderState() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 32);
  headerUpdateQueued = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (headerUpdateQueued) return;
    headerUpdateQueued = true;
    requestAnimationFrame(updateHeaderState);
  },
  { passive: true },
);

updateHeaderState();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  revealItems.forEach((item) => item.classList.add("is-pending"));
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const galleryItems = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("figure img");
const lightboxCount = lightbox.querySelector(".lightbox-count");
const closeButton = lightbox.querySelector(".lightbox-close");
let activeIndex = 0;

function showImage(index) {
  activeIndex = (index + galleryItems.length) % galleryItems.length;
  const source = galleryItems[activeIndex].querySelector("img");
  lightboxImage.src = source.src;
  lightboxImage.alt = source.alt;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  showImage(index);
  lightbox.showModal();
  document.body.classList.add("is-locked");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.close();
  document.body.classList.remove("is-locked");
  galleryItems[activeIndex].focus();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

closeButton.addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(activeIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") showImage(activeIndex - 1);
  if (event.key === "ArrowRight") showImage(activeIndex + 1);
});
