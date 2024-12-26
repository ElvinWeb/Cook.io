export const BASE_API_URL = "https://api.edamam.com/api/recipes/v2";
export const API_KEY = "61f372d785e8df1a4a15b1ec67c86371";
export const CONTAINER_MAX_WIDTH = 1200;
export const CONTAINER_MAX_CARD = 6;
export const THEME_KEY = "theme";
export const APP_ID = "84aca9b1";
export const TYPE = "public";
export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};
export const CARD_QUERIES = [
  ["field", "uri"],
  ["field", "label"],
  ["field", "image"],
  ["field", "totalTime"],
];
export const CUISINE_TYPES = ["Asian", "Italian"];
export const API_ENDPOINTS = {
  recipes: (query) => `${BASE_API_URL}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}` : ""}`,
  detail: (detailId) => `${BASE_API_URL}/${detailId}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`,
  saved: (recipeId, query) => `${BASE_API_URL}/${recipeId}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}` : ""}`,
};
