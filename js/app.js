"use strict";
// Getting the references from HTML.
let deck = document.querySelector(".deck");
let modal = document.querySelector(".modal");
let close = document.querySelector(".close");
let pauseModal = document.querySelector(".pause-modal");
let pause = document.querySelector(".pause");
let imageResume = document.querySelector(".image-resume");
let imageRestart = document.querySelector(".image-restart");
let i = 0,
  count = 0,
  sec = 1,
  min = 0,
  hr = 0,
  flag = 0,
  matchedCnt = 0;
let restart, time, stop;
// array for storing opended cards.
let openedCards = new Array();
restart = document.querySelector(".restart");
// Reload the page when restart button is clicked.
restart.addEventListener("click", () => {
  window.location.reload(true); //Reload the window.
  flag = 0;
});
/*
 * A list that holds all of our cards.
 */
let myCards = [...document.querySelectorAll(".card")];
while (i < myCards.length) {
  // Registering event listener to each card.
  myCards[i].addEventListener("click", display);
  i++;
}
//Display clicked cards.
function display() {
  if (flag == 0) {
    setTimer(); //Start timer for the first click on cards.
    flag++;
  }
  // 'this' refers to the reference that called display function.
  this.classList.add("open", "show", "counter");
  openedCards.push(this); //push reference to array --> openedCards array.
  if (openedCards.length == 2) { //The array should store only two references to compare.
    countMoves();
    matching(); // Makes some delay for opening cards and then compare.
    starCounter(); // Updating no. of stars according to no. of moves made.
  }
}
// function setTimer is called to start timer on first click.
function setTimer() {
  stop = setInterval(myTimer, 1000);
}
//Setup timer.
function myTimer() {
  time = hr + " hr " + min + " min " + sec + " sec ";
  document.querySelector(".time").innerHTML = time;
  sec++;
  if (sec == 60) {
    min++;
    sec = 0;
  }
  if (min == 60) {
    hr++;
    min = 0;
  }
}
//Count no of moves made.
function countMoves() {
  count++;
  document.querySelector(".moves").innerHTML = count;
}
// Find matched cards.
function matching() {
  // Remove the class --> wobble-mismatch since that card can be opened further.
  openedCards[0].classList.remove("wobble-mismatch");
  openedCards[1].classList.remove("wobble-mismatch");
  setTimeout(compare, 500); //Delay after opening cards.
}
//Rating of stars based on no of moves.
function starCounter() {
  if (count >= 17 && count <= 23) {
    document.querySelector(".stars").children[2].children[0].className = "fa fa-star-o";
  }
  if (count <= 32 && count >= 24) {
    document.querySelector(".stars").children[1].children[0].className = "fa fa-star-o";
    document.querySelector(".stars").children[2].children[0].className = "fa fa-star-o";
  }
}
//Comparing opened cards.
function compare() {
  if (openedCards[0].children[0].className == openedCards[1].children[0].className) {
    // If the cards are matched keeps the two cards opened.
    openedCards[0].classList.remove("open", "show", "counter");
    openedCards[0].classList.add("match", "wobble-match");
    openedCards[1].classList.remove("open", "show", "counter");
    openedCards[1].classList.add("match", "wobble-match");
    //  Increase matchedCnt value by 1 when the opened cards are matched.
    matchedCnt++;
    // If matchedCnt value is equal to 8 implies
    // all the cards are matched and the game is over.
    if (matchedCnt == 8) {
      clearInterval(stop); //Stop timer.
      popup(); //Display modal box.
      popupContent(); //Display modal box content.
    }
  } else {
    // If cards do not matched then flip the cards and wobble.
    openedCards[0].classList.remove("open", "show", "counter");
    openedCards[1].classList.remove("open", "show", "counter");
    openedCards[0].classList.add("card", "wobble-mismatch");
    openedCards[1].classList.add("card", "wobble-mismatch");
  }
  openedCards.length = 0; //Clear the array --> openedCards.
}

//popup function is called after all cards are matched.
function popup() {
  // By default modal is hidden.
  modal.style.display = "block";
  close.onclick = function() {
    // On clicking on close icon the modal box should disappear.
    modal.style.display = "none";
  }
}
//Content in the modal box.
function popupContent() {
  // store total time.
  document.querySelector(".total-time").innerHTML = time;
  // Get final stars into f_stars array.
  let f_stars = [...document.querySelectorAll(".stars")];
  // Getting the temporay class names of stars from HTML to replace them with Stars gained.
  let fl_stars = [...document.querySelectorAll(".final-stars")];
  let z = 0;
  // Replace fl_stars array with f_stars to display on popup.
  while (z < 3) {
    fl_stars[0].children[z].children[0].className = f_stars[0].children[z].children[0].className;
    z++;
  }
  document.querySelector(".f-moves").innerHTML = count;
  restart = document.querySelector(".restart");
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Shuffle Cards.
shuffle(myCards).forEach(() => {
  [].forEach.call(myCards, list => {
    deck.appendChild(list);
  });
})

// Adding listener to pause for event recognition.
pause.addEventListener("click", () => {
  // On click stop timer and display pauseModal.
  clearInterval(stop);
  pauseModal.style.display = "block";
});
// Adding listeners to resume and restart images on pauseModal.
imageRestart.addEventListener("click", () => {
  window.location.reload(true); //Reload the window
  flag = 0;
});
imageResume.addEventListener("click", resumeTime);
// on clicking resume the timer.
function resumeTime() {
  pauseModal.style.display = "none";
  setTimer();
}

// Keyboard Shortcuts for pause and restart.
// Key press event --> keyup is used to trigger a function call.
document.onkeyup = function(e) {
  // e.which the read-only property holds the information about the key which was pressed.
  if (e.shiftKey && e.which == 80) { // 80 is the keycode for 'P'.
    clearInterval(stop);
    pauseModal.style.display = "block";
  } else if (e.shiftKey && e.which == 82) { // 82 is the keycode for 'R'.
    window.location.reload(true); //Reload the window
    flag = 0;
  }
}
