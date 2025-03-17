class Renderer2 {
  constructor(pSize, cSize){
    this.size = pSize;
    this.cSize = cSize;
    this.halfRegion = Math.floor(pSize/2);
    this.canvas = this.createPixelCanvas(cSize);
    this.ctx = this.canvas.getContext("2d", { alpha: false });
  }

  createPixelCanvas(canvasSize) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    return canvas;
  }

  drawPixelCanvas(x, y, iCanvas) {
    this.ctx.drawImage(
      iCanvas,
      x-this.halfRegion,
      y-this.halfRegion,
      this.size,
      this.size,
      0,
      0,
      this.cSize,
      this.cSize
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
