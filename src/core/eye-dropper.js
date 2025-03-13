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
  eventHandlers = new Map();
  magnifier = null;

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

    const canvas = document.createElement("canvas");
    canvas.width = this.magnifier.clientWidth;
    canvas.height = this.magnifier.clientHeight;
    const ctx = canvas.getContext("2d");

    const buffer8 = new Uint8Array(imageData.data.buffer); // what is endian, big or little
    const size = 10;
    const handler = (e) => {
      this.drawMagnifierCanvas(ctx, e.clientX, e.clientY, buffer8, size);
    };

    this.eventHandlers.set("mousemove", handler);

    document.body.addEventListener("mousemove", handler, false);
    this.magnifier.appendChild(canvas);
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
  }

  drawMagnifierCanvas(ctx, x, y, bffr, size) {
    const imageWidth = window.innerWidth;
    ctx.strokeStyle = "#363636";
    ctx.lineWidth = 0.2;
    const px = y * imageWidth + x;
    this.drawPixelRow(ctx, px, size, 50, 50, bffr);

    for (let i = 1; i < 6; i++) {
      const tPx = (y - i) * imageWidth + x;
      this.drawPixelRow(ctx, tPx, size, 50, 50 - i * size, bffr);

      const bPx = (y + i) * imageWidth + x;
      this.drawPixelRow(ctx, bPx, size, 50, 50 + i * size, bffr);
    }

    this.highlightMousePixel(ctx, size);
  }

  drawPixelRow(ctx, px, size, x, y, bffr) {
    this.drawPixelColor(ctx, size, x, y, bffr.slice(px * 4, px * 4 + 3));
    for (let i = 1; i < 6; i++) {
      const lPx = (px - i) * 4;
      this.drawPixelColor(ctx, size, x - i * size, y, bffr.slice(lPx, lPx + 3));

      const rPx = (px + i) * 4;
      this.drawPixelColor(ctx, size, x + i * size, y, bffr.slice(rPx, rPx + 3));
    }
  }

  drawPixelColor(ctx, size, x, y, data) {
    ctx.fillStyle = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = `rgb(${255-data[0]}, ${255-data[1]}, ${255-data[2]})`;
    ctx.strokeRect(x, y, size, size);
  }

  highlightMousePixel(ctx, size) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(50, 50, size, size);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.strokeRect(51, 51, size - 2, size - 2);
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
