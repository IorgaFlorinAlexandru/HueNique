class ColorModal {
  static openModal(color) {
    const backdrop = document.createElement("div");
    const modal = document.createElement("div");
    backdrop.classList.add("modal-backdrop");
    modal.classList.add("modal");
    
    const cSqr = document.createElement("div");
    cSqr.classList.add("selected-color");
    cSqr.style.backgroundColor = color.rgb;
    modal.appendChild(cSqr);

    const handler = (e) => {
      e.stopPropagation();
    };

    modal.addEventListener("click", handler, false);

    backdrop.addEventListener(
      "click",
      () => {
        modal.removeEventListener("click", handler, false);
        document.body.removeChild(backdrop);
      },
      { once: true },
    );

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
  }
}
