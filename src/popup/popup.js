const TAB_ACTIVE_CLASS = "tab-button__active";
const POPUP_WIDTH = 335;
const tabs = document.body.querySelectorAll(".tab-button");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    changeTab(tab);
  });
});

browser.storage.local.get("huenique").then((storage) => {
  const recent = storage.huenique.colors.recent;
  if (recent !== null) {
    showRecentColorSection(recent);
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

function showRecentColorSection(color) {
  const container = document.body.querySelector(".color__recent");
  container.style.display = "block";

  const swatch = container.querySelector(".color__details__swatch");
  swatch.style.backgroundColor = color.hex.string;

  const code = container.querySelector(".color__details__content__code");
  code.innerText = color.hex.string;

  container.querySelector(".copy").onclick = () => {
    navigator.clipboard.writeText(color.hex.string);
  }

  container.querySelector(".save").onclick = () => {
    console.error("Not implemented yet");
  }

  container.querySelector(".favorite").onclick = () => {
    console.error("Not implemented yet");
  }

  const formats = container.querySelector(".color__formats");
  [color.rgb, color.hsl].forEach((f) => {
    const div = document.createElement("div");
    div.classList.add("color__format");

    const h4 = document.createElement("h4");
    h4.classList.add("color__format__code");
    h4.innerText = f.string;

    const button = document.createElement("button");
    button.classList.add("button", "color__format__button");
    const svg = container.querySelector(".copy-svg");
    button.appendChild(svg.cloneNode(true));
    button.onclick = () => {
      navigator.clipboard.writeText(f.string);
    };

    div.appendChild(h4);
    div.appendChild(button);
    formats.appendChild(div);
  });
}
