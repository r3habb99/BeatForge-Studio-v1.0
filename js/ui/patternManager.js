/**
 * Pattern Manager Module
 * Handles pattern UI and pattern selector
 */

import { getState } from "../state/stateManager.js";

/**
 * Update pattern selector dropdown
 */
function updatePatternSelector() {
  const state = getState();
  const select = document.getElementById("patternSelect");
  const selectMobile = document.getElementById("patternSelectMobile");

  // Update desktop pattern selector
  if (select) {
    select.innerHTML = "";
    state.patterns.forEach((pattern, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = pattern.name;
      option.selected = index === state.currentPattern;
      select.appendChild(option);
    });
  }

  // Update mobile pattern selector
  if (selectMobile) {
    selectMobile.innerHTML = "";
    state.patterns.forEach((pattern, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = pattern.name;
      option.selected = index === state.currentPattern;
      selectMobile.appendChild(option);
    });
  }
}

export { updatePatternSelector };
