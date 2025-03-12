const eyeDropper = new HueniqueEyeDropper();

function huenique() {
  eyeDropper.open().then((color) => {
    console.log(color.hex);
    navigator.clipboard.writeText("#" + color.hex);
  });
}
