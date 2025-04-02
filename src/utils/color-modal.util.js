class ColorModal {
  static open(color) {
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

        const script = document.createElement("script");

        const handler = (e) => {
          const closeBtn = backdrop.querySelector(".close-btn");
          const hasPressedCloseBtn =
            e.target === closeBtn || closeBtn.contains(e.target);
          if (e.target === backdrop || hasPressedCloseBtn) {
            document.body.removeChild(script);
            backdrop.removeEventListener("click", handler, false);
            document.body.removeChild(backdrop);
          }
        };
        html = html.replace(/{{COLORHEXCODE}}/g, color.hex.string);

        backdrop.setHTMLUnsafe(html);

        const modalScript = backdrop.querySelector("script");
        script.textContent = modalScript.textContent;
        document.body.appendChild(script);
        

        const formats = backdrop.querySelector(".formats");
        if (!formats) {
          throw new Error(
            "Opening modal failed when trying to add color formats",
          );
        }

        const codes = Object.keys(color).splice(0, 3);
        for (let i = 0; i < 3; i++) {
          const format = document.createElement("div");
          format.classList.add("format");
          const info = document.createElement("div");

          const label = document.createElement("div");
          label.classList.add("format-label");
          label.innerText = codes[i];

          let value = color[codes[i]].string;
          const code = document.createElement("div");
          code.classList.add("format-code");
          if (codes[i] === "hex") {
            value = value.toUpperCase();
          }
          code.innerText = value;

          info.appendChild(label);
          info.appendChild(code);
          format.appendChild(info);

          const button = document.createElement("button");
          button.type = "button";
          button.classList.add("modal-btn");
          const svg = backdrop.querySelector("#copy-svg");
          button.appendChild(svg.cloneNode(true));
          button.onclick = () => {
            navigator.clipboard.writeText(value);
          };

          format.appendChild(button);
          formats.appendChild(format);
        }

        const container = backdrop.querySelector(".color-variations");
        if (!container) {
          throw new Error(
            "Failed to open modal when selecting color variations",
          );
        }

        addColorVariationBtn(color.tints, "#tints", container);
        addColorVariationBtn(color.shades, "#shades", container);

        backdrop.addEventListener("click", handler, false);
        document.body.appendChild(backdrop);
      })
      .catch((error) => console.log(error));
  }
}

function addColorVariationBtn(variations, id, container) {
  const div = container.querySelector(id);

  for (let i = 0; i < variations.length; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("var");
    button.style.backgroundColor = variations[i];

    button.onclick = () => {
      navigator.clipboard.writeText(variations[i]);
    };

    div.appendChild(button);
  }
}
