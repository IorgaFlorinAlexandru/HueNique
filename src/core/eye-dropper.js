const styles = {
  eyeDropper: {
    width: "110px",
    height: "110px",
    position: "fixed",
    border: "2px solid white",
    cursor: "none",
    zIndex: "99999",
  },
};

class HueniqueEyeDropper {
  constructor() {
    this.eventHandlers = new Map();
    this.magnifier = null;
    this.renderer = new Renderer(10, 110);
  }

  open() {
    const loadingCapture = this.loadCanvasImage();
    return loadingCapture.then((canvas) => {
      this.createMagnifier();
      this.addMouseMoveEvent(canvas);
      this.disableScroll();

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
    const handler = (e) => {
      this.renderer.drawPixelCanvas(e.clientX, e.clientY, innerWidth, buffer8);
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

  createMagnifier() {
    this.magnifier = document.createElement("div");
    Object.assign(this.magnifier.style, styles.eyeDropper);

    const defaultYPos = 25;
    const defaultXPos = document.body.clientWidth - 150;

    this.magnifier.style.top = defaultYPos + "px";
    this.magnifier.style.left = defaultXPos + "px";

    document.body.appendChild(this.magnifier);
  }

  removeMagnifier() {
    document.body.removeChild(this.magnifier);
    this.magnifier = null;
  }

  onDestroy() {
    this.removeMagnifier();
    this.removeMouseMoveEvent();
    this.enableScroll();
    this.eventHandlers.clear();
    this.renderer.clear();
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
