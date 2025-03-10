const debug = true;
let eyeDropper = null;

function huenique() {
  const sending = browser.runtime.sendMessage({});

  sending.then(
    (imageUri) => {
      createImageCanvas(imageUri);

      if (eyeDropper === null) {
        eyeDropper = createEyeDropper();
      }

      document.body.appendChild(eyeDropper);

      document.body.addEventListener("mousedown", handleMouseClick, {
        once: true,
      });

      if (!debug) {
        document.body.addEventListener("mousemove", handleMouseMove, true);
      }
    },
    (error) => {
      console.log("Error:", error);
    },
  );
}

function handleMouseClick() {
  document.body.removeEventListener("mousemove", handleMouseMove, true);
  document.body.removeChild(eyeDropper);
}

function handleMouseMove(event) {
  console.log(event);
  const posX = event.pageX + 10;
  const posY = event.pageY - eyeDropper.clientWidth - 10;

  setEyeDropperPosition(eyeDropper, posX, posY);
}

function createEyeDropper() {
  const eyeDropper = document.createElement("div");
  eyeDropper.style.width = "120px";
  eyeDropper.style.height = "120px";
  eyeDropper.style.border = "1px solid gray";
  eyeDropper.style.position = "absolute";

  const defaultYPos = 25;
  const defaultXPos = document.body.clientWidth - 150;

  eyeDropper.style.top = defaultYPos + "px";
  eyeDropper.style.left = defaultXPos + "px";

  return eyeDropper;
}

function setEyeDropperPosition(eyeDropper, x, y) {
  eyeDropper.style.top = y + "px";
  eyeDropper.style.left = x + "px";
}

function createImageCanvas(imageUri) {
  console.log(imageUri);
}
