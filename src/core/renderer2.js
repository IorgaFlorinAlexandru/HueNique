class Renderer2 {
  constructor(pSize, cSize) {
    this.size = pSize;
    this.cSize = cSize;
    this.halfRegion = Math.floor(pSize / 2);
    this.canvas = this.createPixelCanvas(cSize);
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.container = this.createContainer(cSize, pSize);
  }

  createContainer(size, regionSize) {
    const div = document.createElement("div");
    div.style.width = size;
    div.style.height = size;
    div.style.position = "relative";

    const gridCanvas = this.createGridCanvas(size, regionSize);
    const highlightCanvas = this.createHighlightCanvas(size, regionSize);

    div.appendChild(this.canvas);
    div.appendChild(gridCanvas);
    div.appendChild(highlightCanvas);

    return div;
  }

  createPixelCanvas(size) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = size;
    canvas.height = size;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    return canvas;
  }

  createGridCanvas(size, regionSize) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.mixBlendMode = "difference";

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.3;

    const pxSize = Math.ceil(size / regionSize);
    for (let i = 1; i < regionSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pxSize, 0);
      ctx.lineTo(i * pxSize, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * pxSize);
      ctx.lineTo(size, i * pxSize);
      ctx.stroke();
    }

    return canvas;
  }

  createHighlightCanvas(size, regionSize) {
    const pxSize = Math.ceil(size / regionSize);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.style.position = "absolute";
    canvas.style.left = "0";

    const ctx = canvas.getContext("2d");
    const mPoint = (size - pxSize) / 2;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(mPoint, mPoint, pxSize, pxSize);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(mPoint - 1, mPoint - 1, pxSize + 2, pxSize + 2);

    return canvas;
  }

  drawPixelCanvas(x, y, iCanvas) {
    this.ctx.drawImage(
      iCanvas,
      x - this.halfRegion,
      y - this.halfRegion,
      this.size,
      this.size,
      0,
      0,
      this.cSize,
      this.cSize,
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
