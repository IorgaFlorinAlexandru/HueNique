class Colors {
  constructor() { }

  static extractPixelColor(canvas, x, y) {
    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;
    
    const uint8Array = new Uint8Array(data.slice(0,3));

    const rgbColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    return { 
      rgb: rgbColor,
      hex: uint8Array.toHex()
    };
  }
}
