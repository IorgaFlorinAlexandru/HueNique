const styles = {
  magnifier: {
    width: "110px",
    height: "110px",
    position: "absolute",
    border: "2px solid #e7e5e4",
    cursor: "none",
    overflow: "hidden",
    boxSizing: "unset",
    borderRadius: "100%",
    zIndex: "99999",
  },
  previewBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    fontSize: "13px",
    width: "200px",
    height: "30px",
    backgroundColor: "#fff",
    position: "absolute",
    boxSizing: "unset",
    borderRadius: "3px",
    zIndex: "99999",
    color: "black",
    background: "#e7e5e4",
    fontFamily: "Verdana, sans-serif",
  },
  colorIndicator: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "1px solid #4e4e4e",
    borderRadius: "3px",
  },
};

class HueniqueEyeDropper {
  constructor() {
    this.eventHandlers = new Map();
    this.magnifier = null;
    this.previewBox = null;
    this.renderer = new Renderer(8, 112);
  }

  open() {
    const loadingCapture = this.loadCanvasImage();
    return loadingCapture.then((canvas) => {
      this.createEyeDropper();
      this.addMouseMoveEvent(canvas);
      this.disableScroll();

      const eyeDropper = this;
      return new Promise(function(resolve) {
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

            return canvas;
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

  addMouseMoveEvent(imageCanvas) {
    const iCtx = imageCanvas.getContext("2d");
    const imageData = iCtx.getImageData(
      0,
      0,
      imageCanvas.width,
      imageCanvas.height,
    );

    const buffer8 = new Uint8Array(imageData.data.buffer); // what is endian, big or little
    const innerWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const handler = (e) => {
      this.moveEyeDropper(e.clientX, e.clientY + scrollY);
      this.renderer.drawPixelCanvas(e.clientX, e.clientY, innerWidth, buffer8);
      this.previewColor(e.clientX, e.clientY, buffer8, innerWidth);
    };

    this.eventHandlers.set("mousemove", handler);

    document.body.addEventListener("mousemove", handler, false);
    this.magnifier.appendChild(this.renderer.canvas);
  }

  removeMouseMoveEvent() {
    const handler = this.eventHandlers.get("mousemove");
    document.body.removeEventListener("mousemove", handler, false);
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
    Object.assign(this.magnifier.style, styles.magnifier);
    Object.assign(this.previewBox.style, styles.previewBox);

    const defaultYPos = 25;
    const defaultXPos = document.body.clientWidth - 150;

    this.magnifier.style.top = defaultYPos + "px";
    this.magnifier.style.left = defaultXPos + "px";

    this.previewBox.style.top = "-30px";
    this.previewBox.style.left = "-200px";

    const colorIndicator = document.createElement("span");
    Object.assign(colorIndicator.style, styles.colorIndicator);
    const text = document.createElement("span");
    this.previewBox.appendChild(colorIndicator);
    this.previewBox.appendChild(text);

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
    this.magnifier.style.left = x - 55 + "px";
    this.magnifier.style.top = y - 55 + "px";
    let pX = x - 100; // 100 half of previewBox Width
    let pY = y + 65; // 55 magnifier width + 10 spacing between

    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight + window.scrollY;

    if (x <= 120) {
      pX = x;
    }
    if (x >= innerWidth - 120) {
      pX = x - 200;
    }

    if (y >= innerHeight - 120) {
      pY = y - 95;
    }

    this.previewBox.style.left = pX + "px";
    this.previewBox.style.top = pY + "px";
  }

  onDestroy() {
    this.removeEyeDropper();
    this.removeMouseMoveEvent();
    this.enableScroll();
    this.eventHandlers.clear();
    this.renderer.clear();
  }

  previewColor(x, y, bffr, width) {
    const hex = Colors.getHexcodeFromPixel(bffr, x, y, width);
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
