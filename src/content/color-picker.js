const eyeDropper = new HueniqueEyeDropper();

function huenique() {
  eyeDropper.open().then((color) => {
    console.log(color);
    navigator.clipboard.writeText(color);
  });
}
