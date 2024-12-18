import { API_ENDPOINTS } from "./config.js";

export const getTime = (minute) => {
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);
  const time = day || hour || minute;
  const unitIndex = [day, hour, minute].lastIndexOf(time);
  const timeUnit = ["days", "hours", "minutes"][unitIndex];

  return { time, timeUnit };
};

export const addEventOnElements = (elements, eventType, callback) => {
  for (const element of elements) {
    element.addEventListener(eventType, callback);
  }
};

export const fetchData = async function (queries, successCallback) {
  const query = queries
    ?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");

  try {
    const response = await fetch(API_ENDPOINTS.recipes(query));

    if (!response.ok) {
      throw new Error("Failed to fetch recipes data");
    }

    const data = await response.json();
    successCallback(data);
  } catch (error) {
    showNotification(error.message);
    throw error;
  }
};
