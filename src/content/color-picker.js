const eyeDropper = new HueniqueEyeDropper();
const mPos = { x: 0, y : 0 };

document.addEventListener('mousemove', (event) => {
  mPos.x = event.clientX;
  mPos.y = event.clientY;
}, { passive: true });

function huenique() {
  eyeDropper.open().then((color) => {
    ColorModal.openModal(color);
  });
}
