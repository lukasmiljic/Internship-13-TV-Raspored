import { generateTVGuide } from "./TVGuide.js";
import {
  addClickEventToSlots,
  addClickEventToWatchlistButton,
} from "./cards.js";
import { addClickEventToPinButton } from "./pin.js";
import {
  addChangeEventToCategoryCheckbox,
  generateCategoryFilters,
  generateStarFilters,
  addChangeEventToWatchlistButton,
} from "./filters.js";

generateTVGuide();
addClickEventToSlots();
addClickEventToWatchlistButton();
addClickEventToPinButton();
generateCategoryFilters();
addChangeEventToCategoryCheckbox();
generateStarFilters();
addChangeEventToWatchlistButton();
