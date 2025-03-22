class ColorModal {
  static openModal(color) {
    const url = browser.runtime.getURL("src/modal/modal.html");
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fetching modal template failed:", response);
        }

        return response.text();
      })
      .then((html) => {
        const backdrop = document.createElement("div");
        backdrop.classList.add("modal-backdrop");

        const handler = (e) => {
          const closeBtn = backdrop.getElementsByClassName("close-btn")[0];
          const hasPressedCloseBtn = e.target === closeBtn || closeBtn.contains(e.target);
          if (e.target === backdrop || hasPressedCloseBtn) {
            backdrop.removeEventListener("click", handler, false);
            document.body.removeChild(backdrop);
          }
        };

        backdrop.addEventListener("click", handler, false);

        html = html.replace(/{{COLORHEXCODE}}/g, "#" + color.hex);

        backdrop.setHTMLUnsafe(html);

        document.body.appendChild(backdrop);
      })
      .catch((error) => console.log(error)); }
}
