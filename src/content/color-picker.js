const eyeDropper = new HueniqueEyeDropper();

function huenique() {
  eyeDropper.open();
}


function createEyeDropper() {
  const eyeDropper = document.createElement("div");
  Object.assign(eyeDropper.style, styles.eyeDropper);

  const defaultYPos = 25;
  const defaultXPos = document.body.clientWidth - 150;

  eyeDropper.style.top = defaultYPos + "px";
  eyeDropper.style.left = defaultXPos + "px";

  return eyeDropper;
}

function createImageCanvas(imageUri) {
  console.log(imageUri);
  const img = document.createElement("img");
  img.style.border = "1px solid red";
  img.style.width = "80%";
  img.style.height = "80%";
  img.src = imageUri;
  document.body.appendChild(img);
}
