import { STORAGE_KEY, THEME } from "./config.js";

/*======= Theme toggler functionality ========*/
const htmlElement = document.documentElement;
const themeBtn = document.querySelector("[data-theme-btn]");

// Initialize theme based on user preference or system setting
const initializeTheme = () => {
  const savedTheme = sessionStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  htmlElement.dataset.theme =
    savedTheme || (prefersDark ? THEME.DARK : THEME.LIGHT);
};

// Toggle theme and update storage
const toggleTheme = function () {
  const isLight = htmlElement.dataset.theme === THEME.LIGHT;
  const newTheme = isLight ? THEME.DARK : THEME.LIGHT;

  this.setAttribute("aria-pressed", !isLight);
  htmlElement.dataset.theme = newTheme;
  sessionStorage.setItem(STORAGE_KEY, newTheme);
};

// Set up theme toggler on page load
window.addEventListener("load", () => {
  initializeTheme();
  themeBtn.addEventListener("click", toggleTheme);
});
