import { fetchData, getTime, addEventOnElements } from "../utils.js";
import {
  CARD_QUERIES,
  CONTAINER_MAX_CARD,
  CONTAINER_MAX_WIDTH,
} from "../config.js";
import { initTheme } from "../theme.js";
import { skeletonCard } from "../common.js";
initTheme();

// Initialize application
// const recipesPage = (function () {
//   function init() {
//     initTheme();
//   }

//   return {
//     init,
//   };
// })();

// recipesPage.init();

