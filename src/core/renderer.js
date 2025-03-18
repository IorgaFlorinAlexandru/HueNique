class Renderer {
  constructor(pixelSize, canvasSize) {
    this.size = pixelSize;
    this.canvas = this.createPixelCanvas(canvasSize);
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.rows = Math.floor(canvasSize / pixelSize);
    this.midPoint = (canvasSize - pixelSize) / 2;
    console.log(this.rows);
  }

  createPixelCanvas(canvasSize) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.strokeStyle = "#363636";
    ctx.lineWidth = 0.2;

    return canvas;
  }

  drawPixelCanvas(x, y, iCtx) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.rows; j++) {
        const data = iCtx.getImageData(x+j, y+i, 1, 1).data;
        this.drawPixel(j*this.size,i*this.size,data.slice(0,3));
      }
    }

    this.highlightMousePixel();
  }

  drawPixel(x, y, data) {
    this.ctx.fillStyle = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    this.ctx.fillRect(x, y, this.size, this.size);
    this.ctx.strokeStyle = `rgb(${255 - data[0]}, ${255 - data[1]}, ${255 - data[2]})`;
    this.ctx.strokeRect(x, y, this.size, this.size);
  }

  highlightMousePixel() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(
      this.midPoint - 1,
      this.midPoint - 1,
      this.size + 2,
      this.size + 2,
    );
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = "white";
    this.ctx.strokeRect(this.midPoint, this.midPoint, this.size, this.size);

    this.ctx.strokeStyle = "#363636";
    this.ctx.lineWidth = 0.2;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
