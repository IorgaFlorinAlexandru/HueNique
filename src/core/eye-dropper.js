const styles = {
  eyeDropper: {
    width: "110px",
    height: "110px",
    position: "fixed",
    border: "1px solid gray",
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
    const width = window.innerWidth;
    const size = 10;
    const handler = (e) => {
      const px = (e.clientY * width + e.clientX) * 4;
      const rgbColor = `rgb(${buffer8[px]}, ${buffer8[px + 1]}, ${buffer8[px + 2]})`;
      ctx.fillStyle = rgbColor;
      for(let i = 0; i < 11; i++) 
        for(let j = 0; j < 11; j++) {
          ctx.fillRect(j*size,i*size,size,size);
      }
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

    this.eventHandlers.set("scroll", scrollHandler);

    window.addEventListener("wheel", scrollHandler, {
      passive: false,
    });
  }

  enableScroll() {
    const handler = this.eventHandlers.get("scroll");
    window.removeEventListener("wheel", handler, false);
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
