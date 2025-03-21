class Colors {
  constructor() {}

  static extractPixelColor(ctx, x, y) {
    const pixel = ctx.getImageData(x, y, 1, 1);

    const u8 = new Uint8Array(pixel.data.slice(0, 3));

    const rgbColor = `rgb(${u8[0]}, ${u8[1]}, ${u8[2]})`;
    return {
      data: u8,
      rgb: rgbColor,
      hex: u8.toHex(),
    };
  }

  static getHexcodeFromPixel(bffr, x, y, width) {
    const i = (y * width + x) * 4;
    const u8 = new Uint8Array(bffr.slice(i, i + 3));

    return "#" + u8.toHex();
  }
}
