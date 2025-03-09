const debug = true;
let div = null;

function colorPicker() {
  if (div === null) {
    div = createDivElement();
  }
  document.body.appendChild(div);

  document.body.addEventListener("mousedown", handleMouseClick, { once: true });

  if (debug) {
    document.body.addEventListener("mousemove", handleMouseMove, true);
  }
}

function handleMouseClick() {
  document.body.removeEventListener("mousemove", handleMouseMove, true);
  document.body.removeChild(div);
}

function handleMouseMove(event) {
  console.log(event);
  const posX = event.pageX + 10;
  const posY = event.pageY - div.clientWidth - 10;

  div.style.left = posX + "px";
  div.style.top = posY + "px";
}

function createDivElement() {
  const element = document.createElement("div");
  styleElement(element)

  return element;
}

function styleElement(element) {
  element.style.position = "absolute";
  element.style.width = "120px";
  element.style.height = "120px";
  element.style.backgroundColor = "transparent";
  element.style.border = "1px solid gray";
  element.style.transition = "ease-in";

  element.style.top = "20px";
  element.style.right = "20px";
}
