class Renderer {
  constructor(pixelSize, canvasSize) {
    this.size = pixelSize;
    this.canvas = this.createPixelCanvas(canvasSize);
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.rows = Math.floor(canvasSize / pixelSize);
    this.midPoint = (canvasSize - pixelSize) / 2;
  }

  createPixelCanvas(canvasSize) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.strokeStyle = "#363636";
    ctx.lineWidth = 0.2;

    return canvas;
  }

  drawPixelCanvas(x, y, width, bffr) {
    const px = y * width + x;
    this.drawPixelRow(px, this.midPoint, this.midPoint, bffr);

    for (let i = 1; i <= this.rows; i++) {
      const tPx = (y - i) * width + x;
      this.drawPixelRow(
        tPx,
        this.midPoint,
        this.midPoint - i * this.size,
        bffr,
      );

      const bPx = (y + i) * width + x;
      this.drawPixelRow(
        bPx,
        this.midPoint,
        this.midPoint + i * this.size,
        bffr,
      );
    }

    this.highlightMousePixel();
  }

  drawPixelRow(px, x, y, bffr) {
    this.drawPixelColor(x, y, bffr.slice(px * 4, px * 4 + 3));
    for (let i = 1; i <= this.rows; i++) {
      const lPx = (px - i) * 4;
      this.drawPixelColor(x - i * this.size, y, bffr.slice(lPx, lPx + 3));

      const rPx = (px + i) * 4;
      this.drawPixelColor(x + i * this.size, y, bffr.slice(rPx, rPx + 3));
    }
  }

  drawPixelColor(x, y, data) {
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