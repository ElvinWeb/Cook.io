import { initTheme } from "../theme.js";

// Initialize application
const detailPage = (function () {
  function init() {
    initTheme();
  }

  return {
    init,
  };
})();

// Start the application
detailPage.init();
