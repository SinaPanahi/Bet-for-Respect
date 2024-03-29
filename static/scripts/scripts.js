const modal = document.querySelector(".main-modal");
const closeButton = document.querySelectorAll(".modal-close");

const modalClose = () => {
  document.body.style = "overflow-y:scroll";
  modal.classList.remove("fadeIn");
  modal.classList.add("fadeOut");
  setTimeout(() => {
    modal.style.display = "none";
  }, 500);
};

const openModal = () => {
  document.body.style = "overflow-y:hidden";
  modal.classList.add("scrollLock");
  modal.classList.remove("fadeOut");
  modal.classList.add("fadeIn");
  modal.style.display = "flex";
};

for (let i = 0; i < closeButton.length; i++) {
  const elements = closeButton[i];

  elements.onclick = (e) => modalClose();

  modal.style.display = "none";

  window.onclick = function (event) {
    if (event.target == modal) modalClose();
  };
}

const slides = document.querySelectorAll(".slide");

// loop through slides and set each slides translateX property to index * 100%
// slides.forEach((slide, indx) => {
//   slide.style.transform = `translateX(${indx * 100}%)`;
// });

// select next slide button
const nextSlide = document.querySelector(".btn-next");

// current slide counter
let curSlide = 0;
// maximum number of slides
let maxSlide = slides.length - 1;

// add event listener and navigation functionality
nextSlide.addEventListener("click", function () {
  // check if current slide is the last and reset current slide
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  //   move slide by -100%
  slides.forEach((slide, indx) => {
    console.log(curSlide, indx);

    slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
  });
});

// select prev slide button
const prevSlide = document.querySelector(".btn-prev");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function () {
  // check if current slide is the first and reset current slide to last
  console.log("yo");
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }

  //   move slide by 100%
  slides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
  });
});

//

function openTab(cityName) {
  let i, tabcontent;
  let tablinks = document.querySelectorAll(".tablinks");
  console.log(tablinks);
  console.log(``);
  let tablink = document.querySelector(`.${cityName.toLowerCase()}-tab`);
  console.log(tablink);
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  for (i = 0; i < tabcontent.length; i++) {
    tablinks[i].classList.remove("border-b-2");
    tablinks[i].classList.remove("border-blue-500");
  }

  tablink.classList.toggle("border-b-2");
  tablink.classList.toggle("border-blue-500");
  document.getElementById(cityName).style.display = "grid";
}

openTab("London");

// form validation

const loginBtn = document.querySelector(".login-btn");
console.log(loginBtn);

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  console.log("yo");
  if (!validateform()) {
    console.log("yo");
  }
  console.log("yp");
});

function validateform() {
  let validate = true;
  let inputs = document.querySelectorAll(".login-input");

  inputs.forEach(function (e) {
    if (e.value.length == "0") {
      console.log("yo");
      validate = false;
      e.classList.toggle("outline ");
      e.classList.toggle("outline-offset-2");
      e.classList.toggle("outline-red");
    }
  });

  return validate;
}
