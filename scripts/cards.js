import {
  channelData,
  watchlist,
  removeItemFromWatchlist,
  pin,
} from "./channelData.js";
import { handleStars } from "./stars.js";

export function addClickEventToSlots() {
  const slots = document.querySelectorAll(".slot");

  slots.forEach((slot) => {
    slot.addEventListener("click", () => {
      generateSlotCard(
        slot.firstElementChild.innerHTML,
        slot.lastElementChild.innerHTML
      );
    });
  });
}

function generateCard() {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");

  cardContainer.innerHTML = `
    <div class="x-wrapper">
      <i id="close" class="fa-solid fa-xmark"></i>
    </div>
    `;

  document.getElementsByTagName("main")[0].appendChild(cardContainer);

  addCloseCardClickEvent(); //this doesn't work

  return cardContainer;
}

function addCloseCardClickEvent() {
  document.querySelectorAll(".fa-xmark").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelector(".card").remove();
    });
  });
}

//slot card
function generateSlotCard(title, startTime) {
  const slot = findSlot(title, startTime);
  if (!promptIfAdult(slot)) return;

  const cardContainer = generateCard();
  cardContainer.classList.add("slot-info");

  const rerun = handleRerunTag(slot);
  const categoriesHTML = generateCategoriesHTML(slot);
  const starsHTML = generateStarsHTML();

  cardContainer.innerHTML += `
    <h3 class="card-title ${rerun}">${slot.title}</h3>
    <div class="card-categories">
      ${categoriesHTML}
    </div>
    <p class="card-time">${slot.startTime} - ${slot.endTime}</p>
    <p>${slot.description}</p>
    ${starsHTML}
    <button style="font-size:14px" id="add-to-watchlist">Add to watchlist</button>
  `;

  handleStars(slot.title, slot.startTime, slot.rating);
  handleWatchlistButton(slot.title);
  addCloseCardClickEvent();
}

function findSlot(title, startTime) {
  const slots = channelData.flatMap((channel) => channel.content);

  const slot = slots.filter(
    (x) => x.startTime === startTime && x.title === title
  )[0];

  return slot;
}

function promptIfAdult(slot) {
  if (slot.adult) {
    const input = prompt("PIN");
    if (input === null) return false;
    if (input != pin) {
      alert("wrong pin");
      return false;
    }
  }
  return true;
}

function handleRerunTag(slot) {
  return slot.Rerun ? "rerun" : "";
}

function generateCategoriesHTML(slot) {
  return slot.Category.reduce(
    (acc, category) => (acc += `<p class="category">${category}</p>`),
    ""
  );
}

function generateStarsHTML() {
  return `
  <div class="stars" style="display:flex">
    <i id="1" class="fa-regular fa-star card-star"></i>
    <i id="2" class="fa-regular fa-star card-star"></i>
    <i id="3" class="fa-regular fa-star card-star"></i>
    <i id="4" class="fa-regular fa-star card-star"></i>
    <i id="5" class="fa-regular fa-star card-star"></i>
  </div>
  `;
}

function handleWatchlistButton(slotTitle) {
  document.getElementById("add-to-watchlist").addEventListener("click", () => {
    if (watchlist.includes(slotTitle)) return;
    watchlist.push(slotTitle);
  });
}

//watchlist card
function generateWatchlistCard() {
  const cardContainer = generateCard();
  cardContainer.classList.add("watchlist");

  const watchlistItemsHTML = generateWatchlistItemsHTML();

  cardContainer.innerHTML = `
    <div class="x-wrapper">
      <i id="close" class="fa-solid fa-xmark"></i>
    </div>
    <h3 class="card-title">Watchlist</h3>
    <div class="list-items">
      ${watchlistItemsHTML}
    </div>
  `;

  handleRemovingItemsFromWatchlist();
  addCloseCardClickEvent();
}

function handleRemovingItemsFromWatchlist() {
  document.querySelectorAll(".watchlist-item").forEach((el) => {
    el.addEventListener("click", () => {
      if (confirm("remove item from watchlist")) {
        removeItemFromWatchlist(el.innerHTML);
        document.querySelector(".card").remove();
        generateWatchlistCard();
      }
    });
  });
}

function generateWatchlistItemsHTML() {
  console.log(watchlist);
  const watchlistItemsHTML = watchlist.reduce(
    (acc, item) => (acc += `<p class="watchlist-item">${item}</p>`),
    ""
  );

  if (watchlistItemsHTML.length == 0) {
    return `<p>Watchlist is empty</p>`;
  }
  return watchlistItemsHTML;
}

export function addClickEventToWatchlistButton() {
  document.getElementById("watchlist-button").addEventListener("click", () => {
    console.log("click");
    generateWatchlistCard();
  });
}
