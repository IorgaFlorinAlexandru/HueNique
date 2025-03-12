class Colors {
  constructor() {}

  static extractPixelColor(canvas, x, y) {
    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;
    console.log(data);

    return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
  }
}
