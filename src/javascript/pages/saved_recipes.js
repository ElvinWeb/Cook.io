import { initTheme } from "../theme.js";
import { getTime } from "../utils.js";

// Saved Recipes Page Module
const savedRecipesPage = (function () {
  // DOM Elements
  const savedRecipeContainer = document.querySelector(
    "[data-saved-recipe-container]"
  );
  const savedRecipeList = document.querySelector("[data-saved-recipe-list]");

  // Private methods
  const createRecipeCard = (savedRecipe, index) => {
    const {
      recipe: { image, label: title, totalTime: cookingTime, uri },
    } = JSON.parse(window.localStorage.getItem(savedRecipe));

    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.animationDelay = `${100 * index}ms`;

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
  };

  const renderSavedRecipes = () => {
    const savedRecipes = Object.keys(window.localStorage).filter((item) =>
      item.startsWith("cookio-recipe")
    );

    if (savedRecipes.length) {
      savedRecipes.forEach((savedRecipe, index) => {
        const card = createRecipeCard(savedRecipe, index);
        savedRecipeList.appendChild(card);
      });
    } else {
      savedRecipeContainer.innerHTML += `<p class="body-large">You don't saved any recipes yet!</p>`;
    }

    savedRecipeContainer.appendChild(savedRecipeList);
  };

  // Batches the saved recipes page functionalities
  const init = () => {
    initTheme();
    renderSavedRecipes();
  };

  return {
    init,
  };
})();

// Start the application
savedRecipesPage.init();
