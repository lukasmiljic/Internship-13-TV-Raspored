import { channelData } from "./channelData.js";

export function handleStars(slotTitle, slotStartTime, slotRating) {
  const stars = document.querySelectorAll(".card-star");

  fillStarsAccordingToChannelData(stars, slotRating);
  handleStarClick(stars, slotTitle, slotStartTime, slotRating);
}

function fillStarsAccordingToChannelData(stars, slotRating) {
  stars.forEach((star) => {
    if (star.id <= slotRating) {
      star.classList.remove("fa-regular");
      star.classList.add("fa-solid");
    }
  });
}

function handleStarClick(stars, slotTitle, slotStartTime, slotRating) {
  stars.forEach((star, index1) => {
    star.addEventListener("click", () => {
      channelData.forEach((channel) => {
        channel.content.forEach((slot) => {
          if (slot.title === slotTitle && slot.startTime === slotStartTime) {
            slot.rating = star.id;
          }
        });
      });
      //fill stars up to desired star
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
