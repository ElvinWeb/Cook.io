import { API_ENDPOINTS } from "./config.js";

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
export const getTime = (minute) => {
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);
  const time = day || hour || minute;
  const unitIndex = [day, hour, minute].lastIndexOf(time);
  const timeUnit = ["days", "hours", "minutes"][unitIndex];

  return { time, timeUnit };
};
export const formatQuery = (queries) => {
  return queries
    ?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");
};
export const addEventOnElements = (elements, eventType, callback) => {
  for (const element of elements) {
    element.addEventListener(eventType, callback);
  }
};
export const fetchRecipesData = async function (
  queries = "",
  id = "",
  param,
  successCallback
) {
  let apiUrl;
  
  switch (param) {
    case "recipes":
      apiUrl = API_ENDPOINTS.recipes(formatQuery(queries));
      break;
    case "details":
      apiUrl = API_ENDPOINTS.detail(id);
      break;
    case "saved":
      apiUrl = API_ENDPOINTS.saved(id, queries);
      break;
    default:
      throw new Error("Invalid parameter");
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    successCallback(data);
  } catch (error) {
    showNotification(error.message);
    throw error;
  }
};
