function colorPicker() {
  const div = document.createElement("div");
  styleElement(div);
  // handleMouseMoveEvent(div);

  document.body.append(div);
}

function handleMouseMoveEvent(element) {
  document.body.addEventListener(
    "mousemove",
    (event) => {
      moveElement(element, event.pageX, event.pageY);
    },
    false,
  );
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

function moveElement(element, mouseX, mouseY) {
  element.style.top = mouseY - element.clientWidth - 10 + "px";
  element.style.left = mouseX + 10 + "px";
}
