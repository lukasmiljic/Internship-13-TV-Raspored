import { channels } from "./channelData.js";

function generateTVGuide() {
  const main = document.getElementsByTagName("main")[0];

  const TVGuideContainer = document.createElement("div");
  TVGuideContainer.classList.add("tv-guide");

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

  main.appendChild(TVGuideContainer);
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
      <div style="width: ${length}%" class="slot" id="content-${slot.title}">
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

// for (let i = 0; i < channels.length; i++) {
//   for (let j = 0; j < channels[i].content.length - 1; j++) {
//     // console.log(
//     //   channels[i].content[j].endTime +
//     //     " " +
//     //     channels[i].content[j + 1].startTime
//     // );
//     if (
//       channels[i].content[j].endTime != channels[i].content[j + 1].startTime
//     ) {
//       console.log(channels[i].content[j].title);
//     }
//   }
// }
