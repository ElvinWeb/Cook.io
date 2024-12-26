import { CARD_QUERIES } from "./config.js";
import { fetchSavedData } from "./utils.js";

const navbarLinks = document.querySelectorAll(".navbar-link");
const activePage = window.location.pathname;

navbarLinks.forEach((link) => {
  if (link.href.includes(activePage)) {
    link.classList.toggle("active");
  }
});

const snackbarContainer = document.createElement("div");
snackbarContainer.classList.add("snackbar-container");
document.body.appendChild(snackbarContainer);

export function showNotification(message) {
  const snackbar = document.createElement("div");
  snackbar.classList.add("snackbar");
  snackbar.innerHTML = `<p class="body-medium">${message}</p>`;
  snackbarContainer.appendChild(snackbar);
  snackbar.addEventListener("animationend", (e) =>
    snackbarContainer.removeChild(snackbar)
  );
}

/* Skeleton card */
export const skeletonCard = `
  <div class="card skeleton-card">

    <div class="skeleton card-banner"></div>

    <div class="card-body">
      <div class="skeleton card-title"></div>

      <div class="skeleton card-text"></div>
    </div>

  </div>
`;

window.saveRecipe = function (element, recipeId) {
  const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

  if (!isSaved) {
    fetchSavedData(CARD_QUERIES, recipeId, function (data) {
      window.localStorage.setItem(
        `cookio-recipe${recipeId}`,
        JSON.stringify(data)
      );
      element.classList.toggle("saved");
      element.classList.toggle("removed");
      showNotification("Added to Recipe book");
    });
  } else {
    window.localStorage.removeItem(`cookio-recipe${recipeId}`);
    element.classList.toggle("saved");
    element.classList.toggle("removed");
    showNotification("Removed from Recipe book");
  }
};
