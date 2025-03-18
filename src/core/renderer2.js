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

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.mixBlendMode = "difference";
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

    const hCanvas = document.createElement("canvas");
    const hCtx = hCanvas.getContext("2d");
    hCanvas.width = size;
    hCanvas.height = size;
    hCanvas.style.position = "absolute";
    hCanvas.style.left = "0";

    const mPoint = (size-pxSize)/2;
    hCtx.strokeStyle = 'white';
    hCtx.lineWidth = 2;
    hCtx.strokeRect(mPoint,mPoint,pxSize, pxSize);

    hCtx.strokeStyle = 'black';
    hCtx.lineWidth = 1;
    hCtx.strokeRect(mPoint-1,mPoint-1,pxSize+2, pxSize+2);

    div.appendChild(this.canvas);
    div.appendChild(canvas);
    div.appendChild(hCanvas);

    return div;
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
