import { channelData } from "./channelData.js";

export function generateTVGuide() {
  const TVGuideContainer = document.getElementById("tv-guide");

  generateSideBar(TVGuideContainer);
  generateScrollArea(TVGuideContainer);
}

function generateSideBar(parentElement) {
  const channelsSideBar = document.createElement("div");
  channelsSideBar.classList.add("channels-sidebar");

  const channelTitles = channelData.map((channel) => channel.channelTitle);
  const channelsSideBarHTML = channelTitles.reduce(
    (HTML, title) =>
      (HTML += ` <img class="channel" src="./assets/images/${title}.png" alt="${title}" /> `),
    ""
  );
  channelsSideBar.innerHTML = channelsSideBarHTML;

  parentElement.appendChild(channelsSideBar);
}

function generateScrollArea(parentElement) {
  const scrollArea = document.createElement("div");
  scrollArea.classList.add("scroll-wrapper");

  // start and end values are hard coded to 6 and 16 because there are no shows outside of that time frame
  // this value is used later when and should be implemented differently
  generateTimeline(scrollArea, 6, 16);
  generateContent(scrollArea);

  parentElement.appendChild(scrollArea);
}

function generateTimeline(parentElement, start, end) {
  const timeline = document.createElement("div");
  timeline.classList.add("timeline");

  let timelineHTML = "";
  for (let i = start; i < end; i++) {
    const time = i < 10 ? "0" + i + ":00" : i + ":00";
    timelineHTML += `<div class="hour">${time}</div>`;
  }
  timeline.innerHTML = timelineHTML;

  parentElement.appendChild(timeline);
}

function generateContent(parentElement) {
  const content = document.createElement("div");
  content.classList.add("content");

  channelData.forEach((channel) => {
    const row = document.createElement("div");
    row.classList.add("row");

    channel.content.forEach((slot) => {
      const length = calcTimeSlotLength(slot.startTime, slot.endTime);

      row.innerHTML += `
      <div style="width: ${length}%" class="slot" id="${slot.title}">
        <div class="slot-title">${slot.title}</div>
        <div class="slot-start-time">${slot.startTime}</div>
      </div>
      `;
    });
    content.appendChild(row);
  });
  parentElement.appendChild(content);
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
