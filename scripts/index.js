import { channels } from "./channelData.js";
let pin = 1234;

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
  cardContainer.classList.add("slot-info-card");

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

  console.log(categoriesHTML);

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
    <p>${slot.rating}/5</p>
  `;

  document.getElementsByTagName("main")[0].appendChild(cardContainer);

  document.getElementById("close").addEventListener("click", () => {
    document.querySelector(".slot-info-card").remove();
  });
}

document.getElementById("pin-button").addEventListener("click", () => {
  let input = prompt("old pin");
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

// document.addEventListener("page-load", () => {
//   document.querySelectorAll(".slot").forEach((el) => {
//     el.addEventListener("mouseover", () => {
//       console.log("hover");
//     });
//   });

//   document.querySelectorAll(".slot").forEach((el) => {
//     el.addEventListener("mouseleave", () => {
//       console.log("mouse leave");
//     });
//   });
// });
