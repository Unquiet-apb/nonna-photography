document.getElementById("year").textContent = new Date().getFullYear();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

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
