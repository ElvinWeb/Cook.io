import { addEventOnElements, fetchData, getTime } from "../utils.js";
import { skeletonCard } from "../common.js";
import { initTheme } from "../theme.js";
import { CARD_QUERIES } from "../config.js";

// Recipe Page Module
const recipesPage = (function () {
  // State management
  const state = {
    nextPageUrl: "",
    requestedBefore: true,
  };

  // DOM Elements
  const elements = {
    accordions: document.querySelectorAll("[data-accordion]"),
    overlay: document.querySelector("[data-overlay]"),
    gridList: document.querySelector("[data-grid-list]"),
    loadMore: document.querySelector("[data-load-more]"),
  };

  // Constants
  const DEFAULT_QUERIES = [
    ["mealType", "breakfast"],
    ["mealType", "dinner"],
    ["mealType", "lunch"],
    ["mealType", "snack"],
    ["mealType", "teatime"],
    ...CARD_QUERIES,
  ];

  // UI Components module
  const Accordion = {
    init(element) {
      const button = element.querySelector("[data-accordion-btn]");
      let isExpanded = false;

      button.addEventListener("click", () => {
        isExpanded = !isExpanded;
        button.setAttribute("aria-expanded", isExpanded);
      });
    },
  };

  // Recipes Handlers module
  const RecipeRendererHandler = {
    render(data) {
      data.hits.forEach((item, index) => {
        const {
          recipe: { image, label: title, totalTime: cookingTime, uri },
        } = item;

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

        const card = document.createElement("div");
        card.classList.add("card");
        card.style.animationDelay = `${100 * index}ms`;

        card.innerHTML = RecipeRendererHandler.getCardTemplate(
          image,
          title,
          recipeId,
          cookingTime,
          isSaved
        );
        elements.gridList.appendChild(card);
      });
    },

    renderAll(data) {
      state.nextPageUrl = data._links.next?.href;
      elements.gridList.innerHTML = "";
      state.requestedBefore = false;

      if (data.hits.length) {
        RecipeRendererHandler.render(data);
      } else {
        elements.loadMore.innerHTML = `<p class="body-medium info-text">No recipe found</p>`;
      }
    },

    getCardTemplate(image, title, recipeId, cookingTime, isSaved) {
      return `
        <figure class="card-media img-holder">
          <img src="${image}" width="195" height="195" loading="lazy" alt="${title}"
            class="img-cover">
        </figure>

        <div class="card-body">
          <h3 class="title-small">
            <a href="./detail.html?recipe=${recipeId}" class="card-link">${
        title ?? "Untitled"
      }</a>
          </h3>

          <div class="meta-wrapper">
            <div class="meta-item">
              <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
              <span class="label-medium">${getTime(cookingTime).time || "<1"} ${
        getTime(cookingTime).timeUnit
      }</span>
            </div>

            <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" 
              aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
              <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
              <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            </button>
          </div>
        </div>
      `;
    },
  };

  // Batches the recipes page functionalities
  const init = function () {
    // Initialize accordion components
    elements.accordions.forEach(Accordion.init);

    // Initialize theme
    initTheme();

    // Initial recipe load
    elements.gridList.innerHTML = skeletonCard.repeat(20);

    // Fetch all recipes
    fetchData(DEFAULT_QUERIES, RecipeRendererHandler.renderAll);
  };

  return { init };
})();

// Initialize the recipe page
recipesPage.init();
