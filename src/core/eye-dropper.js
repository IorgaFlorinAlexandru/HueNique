const styles = {
  eyeDropper: {
    width: "120px",
    height: "120px",
    position: "absolute",
    border: "1px solid gray",
    cursor: "none",
    zIndex: "99999",
  },
};

class HueniqueEyeDropper {
  eventHandlers = new Map();
  constructor() {}

  open() {
    const loadingCapture = this.loadCanvasImage();
    return loadingCapture.then((canvas) => {
      const magnifier = this.createMagnifier();
      this.disableScroll();

      const eyeDropper = this;
      return new Promise(function (resolve) {
        document.body.addEventListener(
          "mousedown",
          (e) => {
            document.body.removeChild(magnifier);
            eyeDropper.onDestroy();

            const color = Colors.extractPixelColor(
              canvas,
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

  createMagnifier() {
    const magnifier = document.createElement("div");
    Object.assign(magnifier.style, styles.eyeDropper);

    const defaultYPos = 25;
    const defaultXPos = document.body.clientWidth - 150;

    magnifier.style.top = defaultYPos + "px";
    magnifier.style.left = defaultXPos + "px";

    document.body.appendChild(magnifier);

    return magnifier;
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

  onDestroy() {
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
