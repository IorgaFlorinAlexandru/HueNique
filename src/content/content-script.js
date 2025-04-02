const INITIAL_STORAGE_STATE = {
  colors: {
    recent: null,
    history: [],
  },
  settings: null,
};

const eyeDropper = new HueniqueEyeDropper();
const mouseData = {
  x: 0,
  y: 0,
  isMouseOver: true,
};

// Settings Storage State
browser.storage.local.get("huenique").then(
  (storage) => {
    console.log(storage);
    if (Object.keys(storage).length === 0) {
      browser.storage.local.set({
        huenique: INITIAL_STORAGE_STATE,
      });
    }
  },
  (error) => {
    console.error("Error:", error);
  },
);

document.addEventListener(
  "mousemove",
  throttle((event) => {
    mouseData.x = event.clientX;
    mouseData.y = event.clientY;
    mouseData.isMouseOver = true;
  }, 100),
  {
    passive: true,
  },
);

document.body.addEventListener(
  "mouseleave",
  () => {
    mouseData.isMouseOver = false;
  },
  { passive: true },
);

function huenique() {
  if (document.body.querySelector(".huenique-modal") !== null) {
    return;
  }

  eyeDropper.open(mouseData).then((color) => {
    ColorModal.open(color);

    browser.storage.local.get("huenique").then(
      (storage) => {
        storage.huenique.colors.recent = color;

        browser.storage.local.set(storage);
      },
      (error) => {
        console.error("Error:", error);
      },
    );
  });
}

//TODO: Move to throttle.ts
function throttle(fn, delay) {
  let lastTime = 0;
  return function(...args) {
    let now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
