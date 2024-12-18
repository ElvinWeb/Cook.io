import { addEventOnElements, fetchData, getTime } from "../utils.js";
import { skeletonCard } from "../common.js";
import { initTheme } from "../theme.js";
import {
  CARD_QUERIES,
  CONTAINER_MAX_CARD,
  CONTAINER_MAX_WIDTH,
} from "../config.js";

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
    filterBar: document.querySelector("[data-filter-bar]"),
    filterTogglers: document.querySelectorAll("[data-filter-toggler]"),
    overlay: document.querySelector("[data-overlay]"),
    filterSubmit: document.querySelector("[data-filter-submit]"),
    filterClear: document.querySelector("[data-filter-clear]"),
    filterSearch: document.querySelector(
      "[data-filter-bar] input[type='search']"
    ),
    filterCount: document.querySelector("[data-filter-count]"),
    filterBtn: document.querySelector("[data-filter-btn]"),
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

  // Filter Handlers module
  const FilterHandler = {
    toggle() {
      elements.filterBar.classList.toggle("active");
      elements.overlay.classList.toggle("active");
      document.body.style.overflow =
        document.body.style.overflow === "hidden" ? "visible" : "hidden";
    },

    submit() {
      const queries = [];
      const filterCheckboxes =
        elements.filterBar.querySelectorAll("input:checked");

      if (elements.filterSearch.value) {
        queries.push(["q", elements.filterSearch.value]);
      }

      if (filterCheckboxes.length) {
        filterCheckboxes.forEach((checkbox) => {
          const key = checkbox.parentElement.parentElement.dataset.filter;
          queries.push([key, checkbox.value]);
        });
      }

      window.location = queries.length
        ? `?${queries.join("&").replace(/,/g, "=")}`
        : "/src/pages/recipes.html";
    },

    clear() {
      const filterCheckboxes =
        elements.filterBar.querySelectorAll("input:checked");
      filterCheckboxes?.forEach((elem) => (elem.checked = false));
      elements.filterSearch.value = "";
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

  // URL Query Handler module
  const QueryHandler = {
    init() {
      const queryStr = window.location.search.slice(1);
      const queries = queryStr && queryStr.split("&").map((i) => i.split("="));

      this.updateFilterCount(queries);
      this.populateFilters(queryStr);

      return queries;
    },

    updateFilterCount(queries) {
      elements.filterCount.style.display = queries.length ? "block" : "none";
      if (queries.length) elements.filterCount.innerHTML = queries.length;
    },

    populateFilters(queryStr) {
      if (!queryStr) return;

      queryStr.split("&").forEach((query) => {
        const [key, value] = query.split("=");
        const decodedValue = value.replace(/%20/g, " ");

        if (key === "q") {
          elements.filterSearch.value = decodedValue;
        } else {
          elements.filterBar.querySelector(
            `[value="${decodedValue}"]`
          ).checked = true;
        }
      });
    },
  };

  // Scroll Handlers module
  const ScrollHandler = {
    init() {
      this.initFilterButtonVisibility();
      this.initInfiniteScroll();
    },

    initFilterButtonVisibility() {
      window.addEventListener("scroll", () => {
        elements.filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"](
          "active"
        );
      });
    },

    async initInfiniteScroll() {
      window.addEventListener("scroll", async () => {
        if (this.isLoadMore()) {
          await this.loadMoreRecipes();
        }

        if (!state.nextPageUrl) {
          elements.loadMore.innerHTML = `<p class="body-medium info-text">No more recipes</p>`;
        }
      });
    },

    isLoadMore() {
      return (
        elements.loadMore.getBoundingClientRect().top < window.innerHeight &&
        !state.requestedBefore &&
        state.nextPageUrl
      );
    },

    async loadMoreRecipes() {
      this.showLoadingState();
      state.requestedBefore = true;

      const data = await this.fetchNextPage();
      state.nextPageUrl = data._links.next?.href;

      RecipeRendererHandler.render(data);
      this.hideLoadingState();
      state.requestedBefore = false;
    },

    showLoadingState() {
      elements.loadMore.innerHTML = skeletonCard.repeat(
        Math.round(
          (elements.loadMore.clientWidth / CONTAINER_MAX_WIDTH) *
            CONTAINER_MAX_CARD
        )
      );
    },

    hideLoadingState() {
      elements.loadMore.innerHTML = "";
    },

    async fetchNextPage() {
      const response = await fetch(state.nextPageUrl);
      return await response.json();
    },
  };

  // Batches the recipes page functionalities
  const init = function () {
    // Initialize accordion components
    elements.accordions.forEach(Accordion.init);

    // Setup filter events
    addEventOnElements(elements.filterTogglers, "click", FilterHandler.toggle);
    elements.filterSubmit.addEventListener("click", FilterHandler.submit);
    elements.filterSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") FilterHandler.submit();
    });
    elements.filterClear.addEventListener("click", FilterHandler.clear);

    // Initialize theme
    initTheme();

    // Handle URL queries
    const queries = QueryHandler.init();

    // Setup scroll events
    ScrollHandler.init();

    // Initial recipe load
    elements.gridList.innerHTML = skeletonCard.repeat(20);

    // Fetch all recipes
    fetchData(queries || DEFAULT_QUERIES, RecipeRendererHandler.renderAll);
  };

  return { init };
})();

// Initialize the recipe page
recipesPage.init();
