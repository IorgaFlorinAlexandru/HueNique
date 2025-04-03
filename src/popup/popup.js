const TAB_ACTIVE_CLASS = "tab-button__active";
const POPUP_WIDTH = 335;
const tabs = document.body.querySelectorAll(".tab-button");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    changeTab(tab);
  });
});

const recentColor = null;
browser.storage.local.get("huenique").then((storage) => {
  const recent = storage.huenique.colors.recent;
  if(recent !== null) {
    recentColor = recent;
  }
});

function changeTab(tab) {
  if (tab.classList.contains(TAB_ACTIVE_CLASS)) return;

  const multiplier = [...tabs].findIndex((t) => t === tab);
  const content = document.body.querySelector(".huenique-popup__content");
  content.style.translate = `${multiplier * -POPUP_WIDTH}px 0px`;

  tabs.forEach((t) => {
    t.classList.remove(TAB_ACTIVE_CLASS);
  });

  tab.classList.add(TAB_ACTIVE_CLASS);
}
