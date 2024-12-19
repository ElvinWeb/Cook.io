import { addEventOnElements, fetchData, getTime } from "../utils.js";
import { CARD_QUERIES, CUISINE_TYPES } from "../config.js";
import { skeletonCard } from "../common.js";
import { initTheme } from "../theme.js";

// Index Page Module
const indexPage = (function () {
  // DOM element references
  const searchField = document.querySelector("[data-search-field]");
  const searchBtn = document.querySelector("[data-search-btn]");
  const tabBtns = document.querySelectorAll("[data-tab-btn]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");
  const sliderSections = document.querySelectorAll("[data-slider-section]");
  let activePanel = tabPanels[0];
  let activeBtn = tabBtns[0];

  // Tab state management module
  const TabState = {
    getActivePanel: () => activePanel,
    getActiveBtn: () => activeBtn,
    setActiveState: (panel, btn) => {
      activePanel = panel;
      activeBtn = btn;
    },
  };

  // Search functionality module
  const SearchHandler = {
    handleSearch(searchValue) {
      if (searchValue.trim()) {
        window.location = `/src/pages/recipes.html?q=${encodeURIComponent(
          searchValue.trim()
        )}`;
      }
    },

    init() {
      searchBtn.addEventListener("click", () =>
        SearchHandler.handleSearch(searchField.value)
      );
      searchField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          SearchHandler.handleSearch(searchField.value);
        }
      });
    },
  };

  // Tab functionality module
  const TabHandler = {
    updateTabPanel(newPanel, newBtn) {
      const currentPanel = TabState.getActivePanel();
      const currentBtn = TabState.getActiveBtn();

      // Hide previous panel
      currentPanel.setAttribute("hidden", "");
      currentBtn.setAttribute("aria-selected", "false");
      currentBtn.setAttribute("tabindex", "-1");

      // Show new panel
      newPanel.removeAttribute("hidden");
      newBtn.setAttribute("aria-selected", "true");
      newBtn.setAttribute("tabindex", "0");

      // Update state
      TabState.setActiveState(newPanel, newBtn);
    },

    handleTabKeyboard(e, currentBtn) {
      const nextBtn = currentBtn.nextElementSibling;
      const prevBtn = currentBtn.previousElementSibling;

      switch (e.key) {
        case "ArrowRight":
          if (nextBtn) {
            currentBtn.setAttribute("tabindex", "-1");
            nextBtn.setAttribute("tabindex", "0");
            nextBtn.focus();
          }
          break;
        case "ArrowLeft":
          if (prevBtn) {
            currentBtn.setAttribute("tabindex", "-1");
            prevBtn.setAttribute("tabindex", "0");
            prevBtn.focus();
          }
          break;
        case "Tab":
          currentBtn.setAttribute("tabindex", "-1");
          TabState.getActiveBtn().setAttribute("tabindex", "0");
          break;
      }
    },

    init() {
      addEventOnElements(tabBtns, "click", function () {
        const newPanel = document.querySelector(
          `#${this.getAttribute("aria-controls")}`
        );
        TabHandler.updateTabPanel(newPanel, this);
        ContentLoader.loadTabContent(this, newPanel);
      });

      addEventOnElements(tabBtns, "keydown", function (e) {
        TabHandler.handleTabKeyboard(e, this);
      });
    },
  };

  // Content loading functionality module
  const ContentLoader = {
    createRecipeCard(recipeData, index = 0) {
      const {
        recipe: { image, label: title, totalTime: cookingTime, uri },
      } = recipeData;

      const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
      const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

      const card = document.createElement("div");
      card.classList.add("card");
      if (index) card.style.animationDelay = `${100 * index}ms`;

      card.innerHTML = `
        <figure class="card-media img-holder">
          <img src="${image}" width="195" height="195" loading="lazy" alt="${title}"
            class="img-cover">
        </figure>
  
        <div class="card-body">
          <h3 class="title-small">
            <a href="/src/pages/detail.html?recipe=${recipeId}" class="card-link">${
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
  
            <button class="icon-btn has-state ${
              isSaved ? "saved" : "removed"
            }" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
              <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
              <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            </button>
          </div>
        </div>
      `;

      return card;
    },

    loadTabContent(currentTabBtn, currentTabPanel) {
      const gridList = document.createElement("div");
      gridList.classList.add("grid-list");

      currentTabPanel.innerHTML = `
        <div class="grid-list">
          ${skeletonCard.repeat(12)}
        </div>
      `;

      fetchData(
        [
          ["mealType", currentTabBtn.textContent.trim().toLowerCase()],
          ...CARD_QUERIES,
        ],
        function (data) {
          currentTabPanel.innerHTML = "";
          const gridList = document.createElement("div");
          gridList.classList.add("grid-list");

          data.hits.slice(0, 12).forEach((item, index) => {
            gridList.appendChild(ContentLoader.createRecipeCard(item, index));
          });

          currentTabPanel.appendChild(gridList);
          currentTabPanel.innerHTML += `
            <a href="/src/pages/recipes.html?mealType=${currentTabBtn.textContent
              .trim()
              .toLowerCase()}" class="btn btn-secondary label-large has-state">Show more</a>
          `;
        }
      );
    },

    loadSliderContent() {
      sliderSections.forEach((section, index) => {
        section.innerHTML = `
          <div class="container">
            <h2 class="section-title headline-small" id="slider-label-1">Latest ${
              CUISINE_TYPES[index]
            } Recipes</h2>
  
            <div class="slider">
              <ul class="slider-wrapper" data-slider-wrapper>
                ${`<li class="slider-item">${skeletonCard}</li>`.repeat(10)}
              </ul>
            </div>
          </div>
        `;

        const sliderWrapper = section.querySelector("[data-slider-wrapper]");

        fetchData(
          [...CARD_QUERIES, ["cuisineType", CUISINE_TYPES[index]]],
          function (data) {
            sliderWrapper.innerHTML = "";

            data.hits.forEach((item) => {
              const sliderItem = document.createElement("li");
              sliderItem.classList.add("slider-item");
              sliderItem.appendChild(ContentLoader.createRecipeCard(item));
              sliderWrapper.appendChild(sliderItem);
            });

            sliderWrapper.innerHTML += `
              <li class="slider-item" data-slider-item>
                <a href="/src/pages/recipes.html?cuisineType=${CUISINE_TYPES[
                  index
                ].toLowerCase()}" class="load-more-card has-state">
                  <span class="label-large">Show more</span>
                  <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
                </a>
              </li>
            `;
          }
        );
      });
    },
  };

  // Batches the index page functionalities
  function init() {
    SearchHandler.init();
    TabHandler.init();
    ContentLoader.loadSliderContent();
    ContentLoader.loadTabContent(
      TabState.getActiveBtn(),
      TabState.getActivePanel()
    );
    initTheme();
  }

  return {
    init,
  };
})();

// Initialize the index page
indexPage.init();
