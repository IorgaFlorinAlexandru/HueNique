class HueniqueEyeDropper {
  constructor() {
    this.eventHandlers = new Map();
    this.magnifier = null;
    this.previewBox = null;
    this.renderer = new Renderer2(13, 104);
  }

  open(mouseData) {
    const loadingCapture = this.loadCanvasImage();
    return loadingCapture.then(([canvas, bffr]) => {
      this.createEyeDropper();
      this.disableScroll();

      let [x, y] = [window.innerWidth - 135, 80];
      if (mouseData.isMouseOver) {
        x = mouseData.x;
        y = mouseData.y;
      }
      this.updateEyeDropper(x, y, canvas, bffr);

      this.addMouseMoveEvent(canvas, bffr);

      const eyeDropper = this;
      return new Promise(function (resolve) {
        document.body.addEventListener(
          "mousedown",
          (e) => {
            eyeDropper.onDestroy();

            const color = Colors.extractPixelColor(
              canvas.getContext("2d"),
              e.clientX,
              e.clientY,
            );

            resolve(color);
          },
          {
            once: true,
          },
        );
      });
    });
  }

  loadCanvasImage() {
    const capture = browser.runtime.sendMessage({
      hueniqueMessage: "HueNique Message To Capture Visible Tab",
    });

    return capture.then(
      (imageUri) => {
        const blob = imageUriToBlob(imageUri);
        return createImageBitmap(blob).then(
          (imageBitmap) => {
            const canvas = document.createElement("canvas");
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(imageBitmap, 0, 0);
            imageBitmap.close();

            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const buffer8 = new Uint8Array(imageData.data.buffer); // what is endian, big or little

            return [canvas, buffer8];
          },
          (error) => {
            console.log("Error while creating bitmap image:", error);
          },
        );
      },
      (error) => {
        console.log("Error while capturing visible tab:", error);
      },
    );
  }

  addMouseMoveEvent(canvas, bffr) {
    const handler = (e) => {
      requestAnimationFrame(() => {
        this.updateEyeDropper(e.clientX, e.clientY, canvas, bffr);
      });
    };

    this.eventHandlers.set("mousemove", handler);
    document.addEventListener("mousemove", handler, {
      passive: true,
      capture: true,
    });
  }

  updateEyeDropper(x, y, canvas, bffr) {
    this.moveEyeDropper(x, y);
    this.renderer.drawPixelCanvas(x, y, canvas);
    this.previewColor(x, y, bffr);
  }

  removeMouseMoveEvent() {
    const handler = this.eventHandlers.get("mousemove");
    document.removeEventListener("mousemove", handler, true);
  }

  disableScroll() {
    const scrollHandler = (e) => {
      e.preventDefault();
    };

    const keyScrollHandler = (e) => {
      console.log(e);
      e.preventDefault();
    };

    this.eventHandlers.set("scroll", scrollHandler);
    this.eventHandlers.set("scrollKey", keyScrollHandler);

    window.addEventListener("wheel", scrollHandler, {
      passive: false,
    });
    window.addEventListener("keydown", keyScrollHandler, {
      passive: false,
    });
  }

  enableScroll() {
    const scrollHandler = this.eventHandlers.get("scroll");
    const keyScrollHandler = this.eventHandlers.get("scrollKey");
    window.removeEventListener("wheel", scrollHandler, false);
    window.removeEventListener("keydown", keyScrollHandler, false);
  }

  createEyeDropper() {
    this.magnifier = document.createElement("div");
    this.previewBox = document.createElement("div");
    this.magnifier.classList.add("huenique-magnifier");
    this.previewBox.classList.add("huenique-preview");

    const colorIndicator = document.createElement("span");
    colorIndicator.classList.add("huenique-color-swatch");
    const text = document.createElement("span");
    this.previewBox.appendChild(colorIndicator);
    this.previewBox.appendChild(text);

    this.magnifier.appendChild(this.renderer.container);

    //const shadowDOM = document.body.attachShadow({ mode: "open" });
    document.body.appendChild(this.magnifier);
    document.body.appendChild(this.previewBox);
  }

  removeEyeDropper() {
    document.body.removeChild(this.magnifier);
    document.body.removeChild(this.previewBox);
    this.magnifier = null;
    this.previewBox = null;
  }

  moveEyeDropper(x, y) {
    y += window.scrollY;
    let pX = x - 100; // 100 half of previewBox Width
    let pY = y + 52; // 55 magnifier width + 10 spacing between

    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight + window.scrollY;

    if (x <= 120) {
      pX = x;
    }
    if (x >= innerWidth - 120) {
      pX = x - 200;
    }

    if (y >= innerHeight - 120) {
      pY = y - 88;
    }

    this.magnifier.setAttribute("style",`transform: translate(${x - 55}px,${y - 55}px)`); 
    this.previewBox.style.transform = `translate(${pX}px,${pY}px)`;
  }

  onDestroy() {
    this.removeEyeDropper();
    this.removeMouseMoveEvent();
    this.enableScroll();
    this.eventHandlers.clear();
    this.renderer.clear();
  }

  previewColor(x, y, bffr) {
    const hex = Colors.getHexcodeFromPixel(x, y, bffr);
    const colorIndicator = this.previewBox.children[0];
    const text = this.previewBox.children[1];
    colorIndicator.style.backgroundColor = hex;
    text.innerText = hex;
  }
}

function imageUriToBlob(imageUri) {
  const [header, base64] = imageUri.split(",");
  const mimeType = header.match(/:(.*?);/)[0];

  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
