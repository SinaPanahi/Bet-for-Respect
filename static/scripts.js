// console.log('test');

// let name = 'Sina'
// let str = `His name is ${name}`

// let str2 = 'His name is ' + name

// console.log(str2);

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
