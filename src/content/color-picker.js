const eyeDropper = new HueniqueEyeDropper();

function huenique() {
  eyeDropper.open().then((color) => {
    console.log(color);
    navigator.clipboard.writeText("#"+color.hex);

    const square = document.createElement("div");
    square.style.width = "100px";
    square.style.height = "100px";
    square.style.background = "#"+color.hex;
    document.body.appendChild(square);
  });
}
