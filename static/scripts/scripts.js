const html = document.documentElement;

const switchToggle = document.querySelector("#switch-toggle");
let isDarkmode = false;

document.addEventListener("DOMContentLoaded", function (event) {
  console.log(localStorage.getItem("theme"));
  if (localStorage.getItem("theme") === "dark") {
    switchToggle.checked = true;
    html.classList.add("dark");
  } else {
    switchToggle.checked = false;
    html.classList.remove("dark");
  }
});

function switchTheme() {
  console.log("yo");
  // const switchToggle = document.querySelector("#switch-toggle");
  console.log(switchToggle.checked);
  if (switchToggle.checked) {
    localStorage.setItem("theme", "dark");
    html.classList.add("dark");
  } else {
    localStorage.setItem("theme", "light");
    html.classList.remove("dark");
  }

  console.log(localStorage.getItem("theme"));
}

switchToggle.addEventListener("click", switchTheme);
