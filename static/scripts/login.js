const loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", (e) => {
  if (!validateform()) {
    e.preventDefault();
  }
});

function validateform() {
  let validate = true;
  let inputs = document.querySelectorAll(".login-input");
  console.log(inputs);
  inputs.forEach(function (e) {
    if (e.value.length == "0") {
      validate = false;
      e.parentNode.classList.toggle("outline");
      e.parentNode.classList.toggle("outline-red-300");
    }
  });

  return validate;
}
