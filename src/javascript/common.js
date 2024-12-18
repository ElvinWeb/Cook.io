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
