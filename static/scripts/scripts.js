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
    slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
  });
});

// select prev slide button
const prevSlide = document.querySelector(".btn-prev");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function () {
  // check if current slide is the first and reset current slide to last
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
  let tablink = document.querySelector(`.${cityName.toLowerCase()}-tab`);
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

openTab("LeagueA");

// Sina: Damn it! I worked for over an hour to fetch the data using JS. Then I realized that I am going to store them in
// DB I need to have access to them in the backend. So, I had to do the whole thing again using Python.

// Sina: fetching game schedule data for the next day
// async function fetchGameScheduleFor(from, to){
//   let response = await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${from}&endDate=${to}`);
//   let data = await response.json();
//   return data;
// }

// // Sina: get the next day date
// function getTomorrowDate(){
//   let today = new Date();
//   let tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
//   let dd = String(tomorrow.getDate()).padStart(2, '0');
//   let mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
//   let yyyy = tomorrow.getFullYear();

//   tomorrow = `${yyyy}-${mm}-${dd}`;
//   return tomorrow;
// }

// // Sina: the games displayed on the scheduled section of the home page will cover 7 days from tomorrow
// function getNextWeekDate(){
//     let today = new Date();
//     let nextWeek = new Date(today.getTime() + 7*(24 * 60 * 60 * 1000));
//     let dd = String(nextWeek.getDate()).padStart(2, '0');
//     let mm = String(nextWeek.getMonth() + 1).padStart(2, '0'); //January is 0!
//     let yyyy = nextWeek.getFullYear();

//     nextWeek = `${yyyy}-${mm}-${dd}`;

//     return nextWeek;
// }

// Sina: creates elements with the data fetched and display them

async function displayGameSchedule(data) {
  const target = document.querySelector("#game-schedules");
  for (const game of data.dates[0].games) {
    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("game-schedule");
    gameWrapper.dataset.details = JSON.stringify(game);

    const gameDate = document.createElement("p");
    const gameTeams = document.createElement("p");
    const gameVenue = document.createElement("p");

    gameDate.textContent = "Games on: " + game.gameDate.substring(0, 10);
    gameTeams.innerHTML = `${game.teams.home.team.name} (home) Vs. ${game.teams.away.team.name} (away)`;
    gameVenue.textContent = "Venue: " + game.venue.name;

    gameWrapper.append(gameDate, gameTeams, gameVenue);
    target.append(gameWrapper);
  }
}

// Sina: adding an eventListener to each schedule game to open a modal when clicked
// Note: Modal heavily simplified
function openScheduledGameOnClick() {
  const targetParent = document.querySelector("#game-schedules");
  targetParent.addEventListener("click", (e) => {
    if (
      e.target.matches(".game-schedule") ||
      e.target.matches(".game-schedule>p")
    ) {
      data = JSON.parse(e.target.closest(".game-schedule").dataset.details);

      document.querySelector("#scheduled-game-date").textContent =
        data.gameDate.substring(0, 10);
      document.querySelector("#scheduled-hometeam-name").textContent =
        data.teams.home.team.name;
      document.querySelector("#scheduled-awayteam-name").textContent =
        data.teams.away.team.name;
      document.querySelector("#stats-hometeam-name").textContent =
        data.teams.home.team.name;
      document.querySelector("#stats-awayteam-name").textContent =
        data.teams.away.team.name;
      document.querySelector("#state-hometeam-wins").textContent =
        data.teams.home.leagueRecord.wins;
      document.querySelector("#state-awayteam-wins").textContent =
        data.teams.away.leagueRecord.wins;
      document.querySelector("#stats-hometeam-losses").textContent =
        data.teams.home.leagueRecord.losses;
      document.querySelector("#stats-awayteam-losses").textContent =
        data.teams.away.leagueRecord.losses;
      document.querySelector("#stats-hometeam-ot").textContent =
        data.teams.home.leagueRecord.ot;
      document.querySelector("#stats-awayteam-ot").textContent =
        data.teams.away.leagueRecord.ot;

      openModal();
    }
  });
}

// Sina: Python fetches the data at the controller level in app.py. Data is first written as Jason string on the
// data attribute of #game-schedules div.
// Data are fetched in the backend so that they can be insterted into DB.
const dataSource = document.querySelector("#game-schedules");
const oneWeekSchedule = JSON.parse(dataSource.dataset.oneweekschedule);
console.log("🚀 ~ file: scripts.js:194 ~ oneWeekSchedule:", oneWeekSchedule);

displayGameSchedule(oneWeekSchedule);
openScheduledGameOnClick();
