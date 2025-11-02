/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for displaying the timer.
 */
let counterElement = document.querySelector(".time") || undefined;
/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for displaying the game title.
 */
let titleElement = document.querySelector(".game_title") || undefined;
/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for displaying the heart count.
 */
let heartElement = document.querySelector(".heart") || undefined;
/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for displaying the counter block.
 */
let counterBlock = document.querySelector(".counter_block") || undefined;
/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for the start button.
 */
let startButton = document.querySelector(".start_button") || undefined;
/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for the generate button.
 */
let generateButton = document.querySelector(".generate_button") || undefined;
/**
 * @type {NodeListOf<HTMLElement>}
 * @description A list of all the block elements in the game.
 */
let blocks = document.querySelectorAll(".block");
/**
 * @type {HTMLElement | undefined}
 * @description The DOM element for the container of the blocks.
 */
let container = document.querySelector(".container");
//--------------------------------------
const gameState = {
  sizeOfBLocks: blocks.length,
  timer_interval: undefined,
  compareSlopts: [],
  compareElement: [],
  startGame: true,
  TIME_HEART: [60, 5],
  time: 60,
  heart: 5,
  winingGameScore: blocks.length,
};
/**
 * @function
 * @description IIFE to initialize the heart and time display.
 */
(() => {
  /// IIFE
  heartElement.innerHTML = gameState.heart;
  counterElement.innerHTML = gameState.time;
})();
//--------------------------------------
/**
 * @function
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random integer between min and max.
 * @description Generates a random integer between a minimum and maximum value.
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * @function
 * @returns {string[]} An array of random RGB color strings.
 * @description Generates an array of random RGB color strings.
 */
function colour() {
  let min = 0,
    max = 255;
  let colour = [];
  for (i = 0; i < Math.floor(gameState.sizeOfBLocks / 2); i++) {
    colour.push(
      `rgb(${random(min, max)},${random(min, max)},${random(min, max)})`
    );
  }
  return colour;
}
/**
 * @function
 * @description Generates and assigns random colors to the game blocks.
 */
function slotGenerator() {
  let colors = colour();
  let colorPosition = 0;
  let isTrue = true;
  let value = undefined;
  counterBlock.style.display = "none";
  heartElement.innerHTML = gameState.heart;
  counterElement.innerHTML = gameState.time;
  startButton.addEventListener("click", startButton_handler);
  blocks.forEach((item) => {
    item.style.background = "none";
  });
  while (isTrue) {
    console.log("looping");
    for (let i = 0; i < gameState.sizeOfBLocks; i++) {
      //checking for empty slot
      value = getComputedStyle(blocks[i]).getPropertyValue("background-color");

      if (reduceString(value) == reduceString("rgba(0,0,0,0)")) {
        break;
      }
      if (i == gameState.sizeOfBLocks - 1) {
        colorPosition = 0;
        isTrue = false;
      }
    }
    let randomIndex = Math.floor(Math.random() * gameState.sizeOfBLocks);
    value = getComputedStyle(blocks[randomIndex]).getPropertyValue(
      "background-color"
    );

    if (reduceString(value) == reduceString("rgba(0,0,0,0)")) {
      // checking slot's color
      if (colorPosition == gameState.sizeOfBLocks / 2) {
        colorPosition = 0;
      }
      blocks[randomIndex].style.background = colors[colorPosition];
      colorPosition++;
    }
  } // while close here
}
/**
 * @function
 * @param {string} message The message to display.
 * @description Handles the game over state.
 */
function gameOver(message) {
  console.log(message);
  counterBlock.style.display = "block";
  titleElement.innerHTML = message;
  clearInterval(gameState.timer_interval);
  generateButton.removeAttribute("disabled", "");
  container.removeEventListener("click", compareSlot);
  blocks.forEach((item) => {
    item.classList.remove("disabled");
  });
}
/**
 * @function
 * @description Handles the win condition.
 */
function handleWin() {
  gameOver("You won!");
  gameState.winingGameScore = gameState.sizeOfBLocks;
  gameState.time += 5;
  if (gameState.heart < 3) {
    gameState.heart += 1;
  }
}
/**
 * @function
 * @description Handles the loss condition.
 */
function handleLoss() {
  gameOver("You lost!");
}
/**
 * @function
 * @description Checks if the win condition has been met.
 */
function checkWinCondition() {
  if (gameState.winingGameScore === 0) {
    handleWin();
  }
}

/**
 * @function
 * @param {Event} e The click event object.
 * @description Handles the logic for comparing two selected blocks.
 */
function compareSlot(e) {
  if (!e.target.classList.contains("block")) {
    return;
  }
  // let slot_handler = () => {
  console.log("slot has clicked");
  // debugger;
  if (gameState.startGame && gameState.heart != 0) {
    if (e.target.classList.contains("disabled")) {
      let style = reduceString(
        getComputedStyle(e.target).getPropertyValue("background-color")
      );
      e.target.classList.remove("disabled");
      gameState.compareSlopts.push(style);
      gameState.compareElement.push(e.target);

      if (gameState.compareElement.length == 2) {
        if (gameState.compareSlopts[0] != gameState.compareSlopts[1]) {
          gameState.heart -= 1;
          heartElement.innerHTML = gameState.heart;
          if (gameState.heart !== 0) {
            gameState.startGame = false;
            setTimeout(() => {
              gameState.compareElement[1].classList.add("disabled");
              gameState.compareElement[0].classList.add("disabled");
              gameState.compareSlopts = [];
              gameState.compareElement = [];
              gameState.startGame = true;
            }, 500);
          } else {
            handleLoss();
          }
        } else {
          gameState.winingGameScore -= 2;
          gameState.compareSlopts = [];
          gameState.compareElement = [];
          checkWinCondition();
        }
      }
    }
  }
}
//--------------------

//--------------------
/**
 * @function
 * @param {string} st The string to reduce.
 * @returns {string} The reduced string.
 * @description Removes all spaces from a string.
 */
function reduceString(st) {
  let tempString = "";
  for (let i of st.split("")) {
    if (i != " ") {
      tempString += i;
    }
  }
  return tempString;
}
let t = Math.sqrt(gameState.sizeOfBLocks);
let width = Math.ceil(t * 51.33 + (t - 1) * 10);
container.style.width = width; //------------------------
/**
 * @function
 * @description Handles the click event for the start button.
 */
function startButton_handler() {
  gameState.timer_interval = setInterval(function () {
    gameState.time--;
    console.log(gameState.time);
    counterElement.innerHTML = gameState.time;
    if (gameState.time == 0) {
      // time out game lost
      gameOver("Time out!");
    }
  }, 1000);

  generateButton.setAttribute("disabled", "");
  blocks.forEach((item) => {
    item.classList.add("disabled");
  });
  container.addEventListener("click", compareSlot);
  startButton.removeEventListener("click", startButton_handler);
  // compareSlot();
}
if (t % 2 == 0) {
  generateButton.addEventListener("click", slotGenerator);
} else {
  titleElement.innerHTML = "Warning";
  counterBlock.style.display = "block";
  console.warn("Slots are not paired");
  generateButton.setAttribute("disabled", "");
  startButton.setAttribute("disabled", "");
}
