import { addEventOnElements, fetchData, getTime } from "../utils.js";
import { skeletonCard } from "../common.js";
import { initTheme } from "../theme.js";

// Recipe Page Module
const recipesPage = (function () {
  // Batches the recipes page functionalities
  const init = function () {
    // Initialize theme
    initTheme();
  };

  return { init };
})();

// Initialize the recipe page
recipesPage.init();
