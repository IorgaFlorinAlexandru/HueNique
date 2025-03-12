const eyeDropper = new HueniqueEyeDropper();

function huenique() {
  eyeDropper.open().then((color) => {
    navigator.clipboard.writeText(color);

    const square = document.createElement("div");
    square.style.width = "100px";
    square.style.height = "100px";
    square.style.background = color;
    document.body.appendChild(square);
  });
}
