let counterElement = document.querySelector(".time") || undefined;
let titleElement = document.querySelector(".game_title") || undefined;
let heartElement = document.querySelector(".heart") || undefined;
let counterBlock = document.querySelector(".counter_block") || undefined;
let startButton = document.querySelector(".start_button") || undefined;
let generateButton = document.querySelector(".generate_button") || undefined;
let blocks = document.querySelectorAll(".block");
let container = document.querySelector(".container");
//--------------------------------------

let sizeOfBLocks = blocks.length;
let timer_interval = undefined;
let compareSlopts = [];
let compareElement = [];
let startGame = true;
const TIME_HEART = [60, 5];
let [time, heart] = TIME_HEART;
let winingGameScore = sizeOfBLocks;
(() => {
  /// IIFE
  heartElement.innerHTML = heart;
  counterElement.innerHTML = time;
})();
//--------------------------------------

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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
