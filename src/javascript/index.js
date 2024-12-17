import { addEventOnElements, fetchData, getTime } from "./utils.js";
import { skeletonCard } from "./common.js";
import { CARD_QUERIES } from "./config.js";
// DOM element references
const searchField = document.querySelector("[data-search-field]");
const searchBtn = document.querySelector("[data-search-btn]");
const tabBtns = document.querySelectorAll("[data-tab-btn]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");

// Track active tab state
const tabState = {
  activePanel: tabPanels[0],
  activeBtn: tabBtns[0],
};

/* Handle search form submission */
const handleSearch = (searchValue) => {
  if (searchValue.trim()) {
    window.location = `/src/pages/recipes.html?q=${encodeURIComponent(
      searchValue.trim()
    )}`;
  }
};

// Search button click handler
searchBtn.addEventListener("click", () => handleSearch(searchField.value));

// Search field enter key handler
searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearch(searchField.value);
  }
});

/* Update tab panel visibility and accessibility attributes */
const updateTabPanel = (newPanel, newBtn) => {
  // Hide previous panel
  tabState.activePanel.setAttribute("hidden", "");
  tabState.activeBtn.setAttribute("aria-selected", "false");
  tabState.activeBtn.setAttribute("tabindex", "-1");

  // Show new panel
  newPanel.removeAttribute("hidden");
  newBtn.setAttribute("aria-selected", "true");
  newBtn.setAttribute("tabindex", "0");

  // Update state
  tabState.activePanel = newPanel;
  tabState.activeBtn = newBtn;
};

// Tab button click handler
addEventOnElements(tabBtns, "click", function () {
  const newPanel = document.querySelector(
    `#${this.getAttribute("aria-controls")}`
  );
  updateTabPanel(newPanel, this);
  addTabContent(this, newPanel);
});

/* Handle keyboard navigation between tabs */
const handleTabKeyboard = (e, currentBtn) => {
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
      tabState.activeBtn.setAttribute("tabindex", "0");
      break;
  }
};

// Tab keyboard navigation
addEventOnElements(tabBtns, "keydown", function (e) {
  handleTabKeyboard(e, this);
});

/* fetch data for tab content */
const addTabContent = (currentTabBtn, currentTabPanel) => {
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

      for (let i = 0; i < 12; i++) {
        const {
          recipe: { image, label: title, totalTime: cookingTime, uri },
        } = data.hits[i];

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

        const card = document.createElement("div");
        card.classList.add("card");
        card.style.animationDelay = `${100 * i}ms`;

        card.innerHTML = `
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
  
                <span class="label-medium">${
                  getTime(cookingTime).time || "<1"
                } ${getTime(cookingTime).timeUnit}</span>
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

        gridList.appendChild(card);
      }

      currentTabPanel.appendChild(gridList);

      currentTabPanel.innerHTML += `
        <a href="./recipes.html?mealType=${currentTabBtn.textContent
          .trim()
          .toLowerCase()}" class="btn btn-secondary label-large has-state">Show more</a>
      `;
    }
  );
};

addTabContent(tabState.activeBtn, tabState.activePanel);
