const TAB_ACTIVE_CLASS = "tab-button__active";
const POPUP_WIDTH = 335;
const tabButtons = document.body.querySelectorAll(".tab-button");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeTab(btn);
  });
});

function changeTab(button) {
  if (button.classList.contains(TAB_ACTIVE_CLASS)) return;

  const multiplier = [...tabButtons].findIndex((b) => b === button);
  const content = document.body.querySelector(".huenique-popup__content");
  content.style.translate = `${multiplier * -POPUP_WIDTH}px 0px`;

  tabButtons.forEach((b) => {
    b.classList.remove(TAB_ACTIVE_CLASS);
  });

  button.classList.add(TAB_ACTIVE_CLASS);
}
