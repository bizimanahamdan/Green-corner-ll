const slides = [...document.querySelectorAll(".slide")];
const progress = document.querySelector(".progress");
const counter = document.querySelector(".counter");
const notesEl = document.querySelector(".notes");
const notesBody = document.querySelector(".notes-body");
const overview = document.querySelector(".overview");
const overviewGrid = document.querySelector(".overview-grid");

let index = 0;
let notesOpen = false;

function titleOf(slide) {
  return slide.dataset.title || slide.querySelector("h1, h2")?.textContent?.trim() || `Slide ${slides.indexOf(slide) + 1}`;
}

function renderOverview() {
  overviewGrid.innerHTML = slides
    .map(
      (slide, i) => `
      <button class="thumb ${i === index ? "is-current" : ""}" data-goto="${i}">
        <strong>${String(i + 1).padStart(2, "0")}</strong>
        <span>${titleOf(slide)}</span>
      </button>`
    )
    .join("");
}

function show(next) {
  index = Math.max(0, Math.min(slides.length - 1, next));
  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  notesBody.textContent = slides[index].dataset.notes || "No speaker notes on this slide.";
  history.replaceState(null, "", `#${index + 1}`);
  renderOverview();
}

function next() {
  show(index + 1);
}
function prev() {
  show(index - 1);
}

document.getElementById("next").addEventListener("click", next);
document.getElementById("prev").addEventListener("click", prev);
document.getElementById("toggle-notes").addEventListener("click", () => {
  notesOpen = !notesOpen;
  notesEl.classList.toggle("is-open", notesOpen);
});
document.getElementById("toggle-overview").addEventListener("click", () => {
  overview.classList.toggle("is-open");
});

overview.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-goto]");
  if (!btn) return;
  show(Number(btn.dataset.goto));
  overview.classList.remove("is-open");
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(key)) {
    e.preventDefault();
    next();
  } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(key)) {
    e.preventDefault();
    prev();
  } else if (key === "Home") {
    show(0);
  } else if (key === "End") {
    show(slides.length - 1);
  } else if (key === "n" || key === "N") {
    notesOpen = !notesOpen;
    notesEl.classList.toggle("is-open", notesOpen);
  } else if (key === "o" || key === "O" || key === "Escape") {
    if (key === "Escape" && overview.classList.contains("is-open")) {
      overview.classList.remove("is-open");
    } else if (key !== "Escape") {
      overview.classList.toggle("is-open");
    } else {
      overview.classList.remove("is-open");
      notesEl.classList.remove("is-open");
      notesOpen = false;
    }
  } else if (key === "p" || key === "P") {
    window.print();
  }
});

let touchX = null;
document.addEventListener(
  "touchstart",
  (e) => {
    touchX = e.changedTouches[0].screenX;
  },
  { passive: true }
);
document.addEventListener(
  "touchend",
  (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchX = null;
  },
  { passive: true }
);

const fromHash = Number(location.hash.replace("#", "")) - 1;
show(Number.isFinite(fromHash) ? fromHash : 0);
