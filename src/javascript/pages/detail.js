import { API_ENDPOINTS, BASE_API_URL } from "../config.js";
import { initTheme } from "../theme.js";
import { getTime, fetchDetailsData } from "../utils.js";
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

