const eyeDropper = new HueniqueEyeDropper();
const mouseData = {
  x: 0,
  y: 0,
  isMouseOver: true,
};

const handleMouseMove = (event) => {
  mouseData.x = event.clientX;
  mouseData.y = event.clientY;
  mouseData.isMouseOver = true;
};

document.addEventListener("mousemove", throttle(handleMouseMove, 100), {
  passive: true,
});

document.body.addEventListener(
  "mouseleave",
  () => {
    mouseData.isMouseOver = false;
  },
  { passive: true },
);

function huenique() {
  eyeDropper.open(mouseData).then((color) => {
    ColorModal.openModal(color);
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
