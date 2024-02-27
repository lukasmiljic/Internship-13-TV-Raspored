import { channels } from "./channelData.js";
let pin = 1234;
let watchlist = [];

function generateTVGuide() {
  // const main = document.getElementsByTagName("main")[0];

  // const TVGuideContainer = document.createElement("div");
  // TVGuideContainer.classList.add("tv-guide");

  const TVGuideContainer = document.getElementById("tv-guide");

  const channelsSideBar = document.createElement("div");
  channelsSideBar.classList.add("channels-sidebar");
  generateSideBar(channelsSideBar);
  TVGuideContainer.appendChild(channelsSideBar);

  const scrollArea = document.createElement("div");
  scrollArea.classList.add("scroll-wrapper");

  const timeline = document.createElement("div");
  timeline.classList.add("timeline");
  generateTimeline(timeline, 6, 16);
  scrollArea.appendChild(timeline);

  const content = document.createElement("div");
  content.classList.add("content");
  generateContent(content);
  scrollArea.appendChild(content);

  TVGuideContainer.appendChild(scrollArea);

  // main.appendChild(TVGuideContainer);
}

function generateSideBar(parentElement) {
  const channelTitles = channels.map((channel) => channel.channelTitle);

  channelTitles.forEach((title) => {
    let channelHTML = "";

    channelHTML += `
      <img
        class="channel"
        src="./assets/images/${title}.png"
        alt="${title}" />
      `;

    parentElement.innerHTML += channelHTML;
  });
}

function generateTimeline(parentElement, start, end) {
  let timelineHTML = "";
  for (let i = start; i < end; i++) {
    // console.log(i);
    const time = i < 10 ? "0" + i + ":00" : i + ":00";
    timelineHTML += `<div class="hour">${time}</div>`;
  }
  parentElement.innerHTML += timelineHTML;
}

function generateContent(parentElement) {
  channels.forEach((channel) => {
    const row = document.createElement("div");
    row.classList.add("row");
    // row.setAttribute("id",`${channel.channelTitle}-row`)

    channel.content.forEach((slot) => {
      const length = calcTimeSlotLength(slot.startTime, slot.endTime);
      // console.log(slot.title + length);
      row.innerHTML += `
      <div style="width: ${length}%" class="slot" id="${slot.title}">
        <div class="slot-title">${slot.title}</div>
        <div class="slot-start-time">${slot.startTime}</div>
      </div>
      `;
    });

    parentElement.appendChild(row);
  });
}

function calcTimeSlotLength(startTime, endTime) {
  const diff = calculateMinutesBetweenDates(startTime, endTime);

  return (diff / (10 * 60)) * 100;
}

function calculateMinutesBetweenDates(startTime, endTime) {
  startTime = "1970-01-01T" + startTime + ":00";
  endTime = "1970-01-01T" + endTime + ":00";

  const date1 = new Date(startTime);
  const date2 = new Date(endTime);

  if (isNaN(date1) || isNaN(date2)) {
    throw new Error("Invalid date format");
  }

  const difference = Math.abs(date2.getTime() - date1.getTime());
  const minutesDifference = Math.floor(difference / (1000 * 60));

  return minutesDifference;
}

generateTVGuide();

// debugger;
const slots = document.querySelectorAll(".slot");
slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    // console.log(slot.firstElementChild.innerHTML);
    // console.log(slot.lastElementChild.innerHTML);
    generateCard(
      slot.firstElementChild.innerHTML,
      slot.lastElementChild.innerHTML
    );
  });
});

//very messy, split this up
function generateCard(title, startTime) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.classList.add("slot-info");

  let slots = [];
  channels.forEach((channel) => {
    channel.content.forEach((slot) => {
      slots.push(slot);
    });
  });

  const slot = slots.filter(
    (x) => x.startTime === startTime && x.title === title
  )[0];
  // console.log(slot);
  if (slot.adult) {
    const input = prompt("PIN");
    if (input === null) return;
    if (input != pin) {
      alert("wrong pin");
      return;
    }
  }
  const rerun = title.rerun ? "rerun" : "";
  const categoriesHTML = slot.Category.reduce(
    (acc, category) => (acc += `<p class="category">${category}</p>`),
    ""
  );

  // console.log(categoriesHTML);

  cardContainer.innerHTML = `
    <div class="x-wrapper">
      <i id="close" class="fa-solid fa-xmark"></i>
    </div>
    <h3 class="card-title ${rerun}">${slot.title}</h3>
    <div class="card-categories">
      ${categoriesHTML}
    </div>
    <p class="card-time">${slot.startTime} - ${slot.endTime}</p>
    <p>${slot.description}</p>
    <div class="stars" style="display:flex">
      <i id="1" class="fa-regular fa-star card-star"></i>
      <i id="2" class="fa-regular fa-star card-star"></i>
      <i id="3" class="fa-regular fa-star card-star"></i>
      <i id="4" class="fa-regular fa-star card-star"></i>
      <i id="5" class="fa-regular fa-star card-star"></i>
    </div>
    <button style="font-size:14px" id="add-to-watchlist">Add to watchlist</button>
  `;

  document.getElementsByTagName("main")[0].appendChild(cardContainer);

  // document.getElementById("close").addEventListener("click", () => {
  //   document.querySelector(".card").remove();
  // });

  handleStars(slot.title, slot.startTime, slot.rating);

  document.querySelectorAll(".fa-xmark").forEach((el) => {
    el.addEventListener("click", () => {
      console.log("click");
      document.querySelector(".card").remove();
    });
  });

  document.getElementById("add-to-watchlist").addEventListener("click", () => {
    if (watchlist.includes(slot)) return;
    watchlist.push(slot);
    console.log(watchlist);
  });
}

//stars
function handleStars(slotTitle, slotStartTime, slotRating) {
  const stars = document.querySelectorAll(".card-star");

  stars.forEach((star, index1) => {
    if (star.id <= slotRating) {
      star.classList.remove("fa-regular");
      star.classList.add("fa-solid");
    }
  });

  stars.forEach((star, index1) => {
    star.addEventListener("click", () => {
      console.log("click");
      console.log(star.id);

      channels.forEach((channel) => {
        channel.content.forEach((slot) => {
          if (slot.title === slotTitle && slot.startTime === slotStartTime) {
            slot.rating = star.id;
            console.log(slot.rating);
          }
        });
      });

      stars.forEach((star, index2) => {
        if (index1 >= index2) {
          star.classList.remove("fa-regular");
          star.classList.add("fa-solid");
        } else {
          star.classList.remove("fa-solid");
          star.classList.add("fa-regular");
        }
      });
    });
  });
}
// document.querySelectorAll(".fa-star").forEach((star) => {
//   star.addEventListener("click", () => {
//     console.log("click");
//   });
// });

//adult pin
document.getElementById("pin-button").addEventListener("click", () => {
  let input = prompt("old pin");
  if (input === null) return;
  if (input != pin) {
    alert("wrong pin");
    return;
  }
  input = prompt("enter new pin");
  // debugger;
  if (input.length >= 4 && input.length <= 8) {
    pin = input;
  } else {
    alert("invalid new pin");
    return;
  }
});

//watchlista
function generateWatchlistCard() {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.classList.add("watchlist");

  let watchlistHTML = watchlist.reduce(
    (acc, item) => (acc += `<p class="watchlist-item">${item.title}</p>`),
    ""
  );

  if (watchlistHTML.length == 0) {
    watchlistHTML = `<p>Watchlist is empty</p>`;
  }

  cardContainer.innerHTML = `
    <div class="x-wrapper">
      <i id="close" class="fa-solid fa-xmark"></i>
    </div>
    <h3 class="card-title">Watchlist</h3>
    <div class="list-items">
      ${watchlistHTML}
    </div>
  `;

  document.getElementsByTagName("main")[0].appendChild(cardContainer);

  document.querySelectorAll(".watchlist-item").forEach((el) => {
    el.addEventListener("click", () => {
      console.log("click");
      console.log(el.innerHTML);
      if (confirm("remove item from watchlist")) {
        // watchlist.remove(watchlist.indexOf((x) => x.title === el.innerHTML));
        watchlist = watchlist.filter((x) => x.title !== el.innerHTML);
        console.log(watchlist);
        document.querySelector(".card").remove();
        generateWatchlistCard();
      }
    });
  });

  document.querySelectorAll(".fa-solid").forEach((el) => {
    el.addEventListener("click", () => {
      console.log("click");
      document.querySelector(".card").remove();
    });
  });
}

document.getElementById("watchlist-button").addEventListener("click", () => {
  console.log("click");
  generateWatchlistCard();
});

//filtering

function generateCategoryFilters() {
  const genre = document.getElementById("genre");
  const categoriesList = extractCategories(channels);

  const categoriesHTML = categoriesList.reduce(
    (acc, category) =>
      (acc += `
      <label class="genre-filter">
        ${category}
      <input class="checkbox" type="checkbox" name="" id="${category}" />
    </label>`),
    ""
  );

  genre.innerHTML = categoriesHTML;
}

generateCategoryFilters();

function extractCategories(channels) {
  const categoriesSet = new Set();

  channels
    .flatMap((channel) =>
      channel.content.flatMap((content) => content.Category)
    )
    .forEach((category) => categoriesSet.add(category));

  return Array.from(categoriesSet);
}

function generateStarFilters() {
  const container = document.getElementById("by-stars");

  for (let i = 0; i < 5; i++) {
    let star = document.createElement("div");
    star.classList.add(`star-filters`);
    star.setAttribute("id", `${i + 1}-stars`);

    for (let j = i; j < 5; j++) {
      star.innerHTML += `<i class="fa-regular fa-star star"></i>`;
    }

    container.appendChild(star);

    star.addEventListener("click", () => {
      console.log("click");
      for (const child of star.children) {
        if (child.classList.contains("fa-regular")) {
          child.classList.remove("fa-regular");
          child.classList.add("fa-solid");
        } else {
          child.classList.remove("fa-solid");
          child.classList.add("fa-regular");
        }
      }

      filterByRating(5 - i);
    });
  }
}

generateStarFilters();

document.querySelectorAll(".checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    rating(checkbox.id, checkbox.checked);
  });
});

console.log(extractCategories(channels));

function rating(filter, checkFlag) {
  slots.forEach((slot) => {
    channels.forEach((channel) => {
      channel.content.forEach((channelsSlot) => {
        if (
          channelsSlot.title == slot.id &&
          (channelsSlot.Category.includes(filter) ||
            channelsSlot.rating === filter) &&
          checkFlag
        ) {
          console.log(slot.id + channelsSlot.Category);
          slot.classList.add("filtered");
        } else if (
          channelsSlot.title == slot.id &&
          (channelsSlot.Category.includes(filter) ||
            channelsSlot.rating === filter) &&
          !checkFlag
        ) {
          slot.classList.remove("filtered");
        }
      });
    });
  });
}

function filterByRating(rating) {
  slots.forEach((slot) => {
    channels.forEach((channel) => {
      channel.content.forEach((channelsSlot) => {
        debugger;
        if (
          channelsSlot.title == slot.id &&
          channelsSlot.startTime == slot.lastElementChild.innerHTML &&
          channelsSlot.rating !== rating &&
          !slot.classList.contains("filtered")
        ) {
          console.log(slot.id + channelsSlot.rating);
          slot.classList.add("filtered");
        } else if (
          channelsSlot.title == slot.id &&
          channelsSlot.startTime == slot.lastElementChild.innerHTML &&
          channelsSlot.rating !== rating &&
          slot.classList.contains("filtered")
        ) {
          slot.classList.remove("filtered");
        }
      });
    });
  });
}
