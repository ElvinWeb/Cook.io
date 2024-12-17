import { THEME_KEY, THEME } from "./config.js";

/*=============== Theme toggler functionality ========*/

// DOM element references
const htmlElement = document.documentElement;
const themeBtn = document.querySelector("[data-theme-btn]");

/* Initialize theme based on user preference or system setting */
const loadThemePreference = function () {
  const savedTheme = sessionStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  htmlElement.dataset.theme =
    savedTheme || (prefersDark ? THEME.DARK : THEME.LIGHT);
};

/* Toggle theme and update storage */
const toggleTheme = function () {
  const isLight = htmlElement.dataset.theme === THEME.LIGHT;
  const newTheme = isLight ? THEME.DARK : THEME.LIGHT;

  this.setAttribute("aria-pressed", !isLight);
  htmlElement.dataset.theme = newTheme;
  sessionStorage.setItem(THEME_KEY, newTheme);
};

// Initialize theme toggler
const initTheme = () => {
  window.addEventListener("load", () => {
    loadThemePreference();
    themeBtn.addEventListener("click", toggleTheme);
  });
};

export { initTheme };
