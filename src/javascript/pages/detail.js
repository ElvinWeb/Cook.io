import { getTime, fetchRecipesData } from "../utils.js";
import { initTheme } from "../theme.js";

// Detail Page Module
const detailPage = (function () {
  // DOM elements
  const detailContainer = document.querySelector("[data-detail-container]");
  const detailId = window.location.search.slice(
    window.location.search.indexOf("=") + 1
  );

  // State
  const state = {
    recipe: null,
    isSaved: false,
  };

  // Helper functions
  const getRecipeId = (uri) => uri.slice(uri.lastIndexOf("_") + 1);

  const getTagType = (tag, { cuisineType, dietLabels }) => {
    if (cuisineType.includes(tag)) return "cuisineType";
    if (dietLabels.includes(tag)) return "diet";
    return "dishType";
  };

  const generateTagElements = (tags, recipeData) => {
    return tags
      .map((tag) => {
        const type = getTagType(tag, recipeData);
        return `<a href="/src/pages/recipes.html?${type}=${tag.toLowerCase()}" 
              class="filter-chip label-large has-state">${tag}</a>`;
      })
      .join("");
  };

  const generateIngredientElements = (ingredients) => {
    return ingredients
      .map((ingredient) => `<li class="ingr-item">${ingredient}</li>`)
      .join("");
  };

  // UI rendering
  const renderRecipeDetails = (recipeData) => {
    const {
      images: { LARGE, REGULAR, SMALL, THUMBNAIL },
      label: title,
      source: author,
      ingredients = [],
      totalTime: cookingTime = 0,
      calories = 0,
      cuisineType = [],
      dietLabels = [],
      dishType = [],
      yield: servings = 0,
      ingredientLines = [],
      uri,
    } = recipeData;

    // Update page title
    document.title = `Cook.io | ${title}`;

    // Process image data
    const banner = LARGE ?? REGULAR ?? SMALL ?? THUMBNAIL;
    const { url: bannerUrl, width, height } = banner;

    // Process tags and ingredients
    const tags = [...cuisineType, ...dietLabels, ...dishType];
    const recipeId = getRecipeId(uri);
    state.isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

    const tagElements = generateTagElements(tags, { cuisineType, dietLabels });
    const ingredientItems = generateIngredientElements(ingredientLines);
    const btn =
      // Render template
      (detailContainer.innerHTML = `
      <figure class="detail-banner img-holder">
        <img src="${bannerUrl}" width="${width}" height="${height}" alt="${title}"
          class="img-cover">
      </figure>
  
      <div class="detail-content">
        <div class="title-wrapper">
          <h1 class="display-small">${title ?? "Untitled"}</h1>
  
          <button class="btn btn-secondary has-state has-icon ${
            state.isSaved ? "saved" : "removed"
          }" onclick="saveRecipe(this, '${recipeId}')">
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            <span class="label-large save-text">Save</span>
            <span class="label-large unsaved-text">Unsaved</span>
          </button>
        </div>
  
        <div class="detail-author label-large">
          <span class="span">by</span> ${author}
        </div>
  
        <div class="detail-stats">
          <div class="stats-item">
            <span class="display-medium">${ingredients.length}</span>
            <span class="label-medium">Ingredients</span>
          </div>
  
          <div class="stats-item">
            <span class="display-medium">${
              getTime(cookingTime).time || "<1"
            }</span>
            <span class="label-medium">${getTime(cookingTime).timeUnit}</span>
          </div>
  
          <div class="stats-item">
            <span class="display-medium">${Math.floor(calories)}</span>
            <span class="label-medium">Calories</span>
          </div>
        </div>
  
        ${tagElements ? `<div class="tag-list">${tagElements}</div>` : ""}
  
        <h2 class="title-medium ingr-title">
          Ingredients
          <span class="label-medium">for ${servings} Servings</span>
        </h2>
  
        ${
          ingredientItems
            ? `<ul class="body-large ingr-list">${ingredientItems}</ul>`
            : ""
        }
      </div>
    `);
  };

  // Data fetching
  const loadRecipeDetails = () => {
    fetchRecipesData(undefined, detailId, "details", (data) => {
      state.recipe = data.recipe;
      renderRecipeDetails(state.recipe);
    });
  };

  // Batches the recipe detail page functionalities
  function init() {
    initTheme();
    loadRecipeDetails();
  }

  return {
    init,
  };
})();

// Start the application
detailPage.init();
