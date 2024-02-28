import { channelData, watchlist } from "./channelData.js";

//category filters
export function generateCategoryFilters() {
  const genre = document.getElementById("by-genre");
  const categoriesHTML = generateCategoriesHTML();

  genre.innerHTML = categoriesHTML;
}

function generateCategoriesHTML() {
  const categoriesList = extractCategories(channelData);

  return categoriesList.reduce(
    (HTML, category) =>
      (HTML += `
      <label class="genre-filter">
        ${category}
      <input class="category-checkbox" type="checkbox" name="" id="${category}" />
    </label>`),
    ""
  );
}

function extractCategories(channels) {
  const categoriesSet = new Set();

  channels
    .flatMap((channel) =>
      channel.content.flatMap((content) => content.Category)
    )
    .forEach((category) => categoriesSet.add(category));

  return Array.from(categoriesSet);
}

export function addChangeEventToCategoryCheckbox() {
  document.querySelectorAll(".category-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      filterByCategory(checkbox.id, checkbox.checked);
    });
  });
}

function filterByCategory(category, shouldFilterFlag) {
  const slotsChannelData = getAllSlots();
  const slotsHTML = document.querySelectorAll(".slot");

  slotsHTML.forEach((slotHTML) => {
    slotsChannelData.forEach((slotChannelData) => {
      if (
        slotChannelData.title == slotHTML.id &&
        slotChannelData.Category.includes(category) &&
        shouldFilterFlag
      ) {
        slotHTML.classList.add("filtered");
      } else if (
        slotChannelData.title == slotHTML.id &&
        slotChannelData.Category.includes(category) &&
        !shouldFilterFlag
      ) {
        slotHTML.classList.remove("filtered");
      }
    });
  });
}

function getAllSlots() {
  return channelData.flatMap((channel) => channel.content);
}

//star filters
export function generateStarFilters() {
  const container = document.getElementById("by-stars");

  for (let i = 0; i < 5; i++) {
    let starRow = generateRowOfStars(i + 1);
    for (let j = i; j < 5; j++) {
      generateIndividualStars(starRow);
    }
    container.appendChild(starRow);
    addClickEventToStarRow(starRow, i);
  }
}

function generateRowOfStars(starCount) {
  const starRow = document.createElement("div");
  starRow.classList.add(`star-filters`);
  starRow.setAttribute("id", `${starCount}-stars`);

  return starRow;
}

function generateIndividualStars(parentElement) {
  parentElement.innerHTML += `<i class="fa-regular fa-star star"></i>`;
}

function addClickEventToStarRow(starRow, i) {
  starRow.addEventListener("click", () => {
    console.log("click");
    colorStars(starRow);
    filterByRating(5 - i);
  });
}

function colorStars(starRow) {
  for (const star of starRow.children) {
    if (star.classList.contains("fa-regular")) {
      star.classList.remove("fa-regular");
      star.classList.add("fa-solid");
    } else {
      star.classList.remove("fa-solid");
      star.classList.add("fa-regular");
    }
  }
}

function filterByRating(rating) {
  const slotsChannelData = getAllSlots();
  const slotsHTML = document.querySelectorAll(".slot");

  slotsHTML.forEach((slotHTML) => {
    slotsChannelData.forEach((slotChannelData) => {
      if (
        slotChannelData.title == slotHTML.id &&
        slotChannelData.startTime == slotHTML.lastElementChild.innerHTML &&
        slotChannelData.rating !== rating &&
        !slotHTML.classList.contains("filtered")
      ) {
        console.log(slotHTML.id + slotChannelData.rating);
        slotHTML.classList.add("filtered");
      } else if (
        slotChannelData.title == slotHTML.id &&
        slotChannelData.startTime == slotHTML.lastElementChild.innerHTML &&
        slotChannelData.rating !== rating &&
        slotHTML.classList.contains("filtered")
      ) {
        slotHTML.classList.remove("filtered");
      }
    });
  });
}

export function addChangeEventToWatchlistButton() {
  const watchlistCheckBox = document.getElementById("by-watchlist");
  watchlistCheckBox.addEventListener("change", () => {
    filterByWatchlist(watchlistCheckBox.checked);
  });
}

function filterByWatchlist(shouldFilterFlag) {
  const slots = document.querySelectorAll(".slot");

  slots.forEach((slot) => {
    if (!watchlist.includes(slot.id) && shouldFilterFlag) {
      slot.classList.add("filtered");
    } else if (!watchlist.includes(slot.id) && !shouldFilterFlag) {
      slot.classList.remove("filtered");
    }
  });
}
