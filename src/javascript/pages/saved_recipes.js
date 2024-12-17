import { initTheme } from "../theme.js";

// Initialize application
const savedRecipesPage = (function () {
  function init() {
    initTheme();
  }

  return {
    init,
  };
})();

// Start the application
savedRecipesPage.init();
