const styles = {
  eyeDropper: {
    width: "120px",
    height: "120px",
    position: "absolute",
    border: "1px solid gray",
  },
};

class HueniqueEyeDropper {
  magnifier = null;
  debug = true;

  constructor() {
    this.#createMagnifier();
  }

  open() {
    const imgMessage = browser.runtime.sendMessage({});

    imgMessage.then(
      (imageUri) => {
        document.body.appendChild(this.magnifier);

        const htmlElement = this.magnifier;

        const handler = function(event) {
          console.log(event);
          const posX = event.pageX + 10;
          const posY = event.pageY - htmlElement.clientWidth - 10;

          htmlElement.style.top = `${posY}px`;
          htmlElement.style.left = `${posX}px`;
        };

        //document.body.addEventListener("mousemove", handler, true);

        document.body.addEventListener(
          "mousedown",
          (event) => {
            console.log(event);
            // TODO: Do this when receiving imageUri, including the uri to blob part
            const canvas = document.createElement("canvas");
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            const ctx = canvas.getContext("2d");
            const blob = imageUriToBlob(imageUri);

            createImageBitmap(blob).then((imageBitmap) => {
              ctx.drawImage(imageBitmap, 0, 0);

              // Pixel data
              const pixel = ctx.getImageData(
                event.clientX,
                event.clientY,
                1,
                1,
              );
              const data = pixel.data;

              const rgbColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
              console.log(rgbColor);
              const square = document.createElement("div");
              square.style.width = "100px";
              square.style.height = "100px";
              square.style.margin = "20px";
              square.style.background = rgbColor;

              document.body.appendChild(square);
            });

            document.body.removeEventListener("mousemove", handler, true);
            document.body.removeChild(this.magnifier);
          },
          {
            once: true,
          },
        );
      },
      (error) => {
        console.log("Error:", error);
      },
    );
  }

  #createMagnifier() {
    this.magnifier = document.createElement("div");
    Object.assign(this.magnifier.style, styles.eyeDropper);

    const defaultYPos = 25;
    const defaultXPos = document.body.clientWidth - 150;

    this.magnifier.style.top = defaultYPos + "px";
    this.magnifier.style.left = defaultXPos + "px";
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
