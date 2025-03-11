const styles = {
  eyeDropper: {
    width: "120px",
    height: "120px",
    position: "absolute",
    border: "1px solid gray",
  },
};

class HueniqueEyeDropper {
  constructor() {
    this.createMagnifier();
  }

  open() {
    const canvasPromise = this.loadCanvasImage();
    return canvasPromise.then((canvas) => {
      const magnifier = this.createMagnifier();

      document.body.appendChild(magnifier);
      const handler = function(event) {
        console.log(event);
        const posX = event.pageX + 10;
        const posY = event.pageY - magnifier.clientWidth - 10;

        magnifier.style.top = `${posY}px`;
        magnifier.style.left = `${posX}px`;
      };

      //document.body.addEventListener("mousemove", handler, true);

      return new Promise(function(resolve) {
        document.body.addEventListener(
          "mousedown",
          (e) => {
            const color = HueniqueEyeDropper.extractPixelColor(
              canvas,
              e.clientX,
              e.clientY,
            );

            document.body.removeEventListener("mousemove", handler, true);
            document.body.removeChild(magnifier);

            resolve(color);
          },
          {
            once: true,
            capture: false
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

  static extractPixelColor(canvas, x, y) {
    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;

    const rgbColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    const square = document.createElement("div");
    square.style.width = "100px";
    square.style.height = "100px";
    square.style.margin = "20px";
    square.style.background = rgbColor;
    document.body.appendChild(square);

    return rgbColor;
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
