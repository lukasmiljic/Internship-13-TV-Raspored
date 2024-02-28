import { pin, updatePin } from "./channelData.js";

export function addClickEventToPinButton() {
  document.getElementById("pin-button").addEventListener("click", () => {
    let input = prompt("old pin");
    if (input === null) return;
    if (input != pin) {
      alert("wrong pin");
      return;
    }
    input = prompt("enter new pin");
    validateNewPin(input) ? updatePin : alert("invalid new pin");
  });
}

function validateNewPin(pin) {
  if (pin.length >= 4 && pin.length <= 8) return true;
  return false;
}
