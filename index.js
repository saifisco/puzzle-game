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
/**
 * @type {number}
 * @description The total number of blocks in the game.
 */
let sizeOfBLocks = blocks.length;
/**
 * @type {number | undefined}
 * @description The interval ID for the timer.
 */
let timer_interval = undefined;
/**
 * @type {string[]}
 * @description An array to store the colors of the slots being compared.
 */
let compareSlopts = [];
/**
 * @type {HTMLElement[]}
 * @description An array to store the DOM elements of the slots being compared.
 */
let compareElement = [];
/**
 * @type {boolean}
 * @description A flag to indicate if the game has started.
 */
let startGame = true;
/**
 * @type {number[]}
 * @description An array containing the initial time and heart count.
 */
const TIME_HEART = [60, 5];
/**
 * @type {number}
 * @description The current time remaining in the game.
 */
/**
 * @type {number}
 * @description The current number of hearts remaining in the game.
 */
let [time, heart] = TIME_HEART;
/**
 * @type {number}
 * @description The number of blocks that still need to be matched to win the game.
 */
let winingGameScore = sizeOfBLocks;
/**
 * @function
 * @description IIFE to initialize the heart and time display.
 */
(() => {
  /// IIFE
  heartElement.innerHTML = heart;
  counterElement.innerHTML = time;
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
  for (i = 0; i < Math.floor(sizeOfBLocks / 2); i++) {
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
  heartElement.innerHTML = heart;
  counterElement.innerHTML = time;
  startButton.addEventListener("click", startButton_handler);
  blocks.forEach((item) => {
    item.style.background = "none";
  });
  while (isTrue) {
    console.log("looping");
    for (let i = 0; i < sizeOfBLocks; i++) {
      //checking for empty slot
      value = getComputedStyle(blocks[i]).getPropertyValue("background-color");

      if (reduceString(value) == reduceString("rgba(0,0,0,0)")) {
        break;
      }
      if (i == sizeOfBLocks - 1) {
        colorPosition = 0;
        isTrue = false;
      }
    }
    let randomIndex = Math.floor(Math.random() * sizeOfBLocks);
    value = getComputedStyle(blocks[randomIndex]).getPropertyValue(
      "background-color"
    );

    if (reduceString(value) == reduceString("rgba(0,0,0,0)")) {
      // checking slot's color
      if (colorPosition == sizeOfBLocks / 2) {
        colorPosition = 0;
      }
      blocks[randomIndex].style.background = colors[colorPosition];
      colorPosition++;
    }
  } // while close here
}
/**
 * @function
 * @param {Event} e The click event object.
 * @description Handles the logic for comparing two selected blocks.
 */
function compareSlot(e) {
  // let slot_handler = () => {
  console.log("slot has clicked");
  // debugger;
  if (startGame && heart != 0) {
    if (e.target.classList.contains("disabled")) {
      let style = reduceString(
        getComputedStyle(e.target).getPropertyValue("background-color")
      );
      e.target.classList.remove("disabled");
      compareSlopts.push(style);
      compareElement.push(e.target);

      if (compareElement.length == 2) {
        if (compareSlopts[0] != compareSlopts[1]) {
          heart -= 1;
          heartElement.innerHTML = heart;
          if (heart != 0) {
            startGame = false;
            setTimeout(() => {
              compareElement[1].classList.add("disabled");
              compareElement[0].classList.add("disabled");
              compareSlopts = [];
              compareElement = [];
              startGame = true;
            }, 500);
          }
        } else {
          compareSlopts = [];
          compareElement = [];
        }
        if (compareSlopts[0] == compareSlopts[1]) {
          winingGameScore = winingGameScore - 2;
          for (let i = 0; i < blocks.length; i++) {
            // debugger;
            if (!blocks[i].classList.contains("disabled")) {
              blocks[i].removeEventListener("click", compareSlot);
            }
            // if (blocks[i].classList.contains("disabled")) {
            //   console.log("some slots has disabled");
            //   // break;
            // }
            if (i == blocks.length - 1 && winingGameScore == 0) {
              compareSlopts = [];
              compareElement = [];
              winingGameScore = sizeOfBLocks;
              // if won the game
              console.log("you won the game;");
              counterBlock.style.display = "block";
              titleElement.innerHTML = "You won!";
              generateButton.removeAttribute("disabled", "");
              winingGameScore = sizeOfBLocks;
              time += 5;
              if (heart < 3) {
                heart += 1;
              }
              clearInterval(timer_interval);
            }
          }
          console.log(winingGameScore);
        }
      }
    }
  }
  if (heart == 0) {
    // if game over
    compareSlopts = [];
    compareElement = [];
    winingGameScore = sizeOfBLocks;
    [time, heart] = TIME_HEART;
    console.log("You lost the game");
    counterBlock.style.display = "block";
    titleElement.innerHTML = "You lost!";
    clearInterval(timer_interval);
    generateButton.removeAttribute("disabled", "");
    blocks.forEach((item) => {
      item.removeEventListener("click", compareSlot);
      item.classList.remove("disabled");
    });
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
let t = Math.sqrt(sizeOfBLocks);
let width = Math.ceil(t * 51.33 + (t - 1) * 10);
container.style.width = width; //------------------------
/**
 * @function
 * @description Handles the click event for the start button.
 */
function startButton_handler() {
  timer_interval = setInterval(function () {
    time--;
    console.log(time);
    counterElement.innerHTML = time;
    if (time == 0) {
      // time out game lost
      winingGameScore = sizeOfBLocks;

      clearInterval(timer_interval);
      [time, heart] = TIME_HEART;
      counterBlock.style.display = "block";
      titleElement.innerHTML = "Time out!";
      console.log("You lost the game");
      clearInterval(timer_interval);
      generateButton.removeAttribute("disabled", "");
      blocks.forEach((item) => {
        item.removeEventListener("click", compareSlot);
        item.classList.remove("disabled");
      });
      // }
    }
  }, 1000);

  generateButton.setAttribute("disabled", "");
  blocks.forEach((item) => {
    item.classList.add("disabled");
    item.addEventListener("click", compareSlot);
  });
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
