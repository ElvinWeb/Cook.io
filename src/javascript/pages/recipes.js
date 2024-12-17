import { initTheme } from "../theme.js";

// Initialize application
const recipesPage = (function () {
  function init() {
    initTheme();
  }

  return {
    init,
  };
})();

// Start the application
recipesPage.init();