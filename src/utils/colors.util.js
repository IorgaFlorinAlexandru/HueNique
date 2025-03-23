class Colors {
  constructor() { }

  static extractPixelColor(ctx, x, y) {
    const pixel = ctx.getImageData(x, y, 1, 1);

    const u8 = new Uint8Array(pixel.data.slice(0, 3));
    const hexcode = u8.toHex();
    const hsl = Colors.toHSL(u8);

    return {
      hex: {
        data: hexcode,
        string: "#" + hexcode,
      },
      rgb: {
        data: u8,
        string: `rgb(${u8[0]}, ${u8[1]}, ${u8[2]})`,
      },
      hsl: hsl,
      tints: Colors.generateTints(hsl.data),
      shades: Colors.generateShades(hsl.data),
    };
  }

  static getHexcodeFromPixel(bffr, x, y, width) {
    const i = (y * width + x) * 4;
    const u8 = new Uint8Array(bffr.slice(i, i + 3));

    return "#" + u8.toHex();
  }

  //TODO: move logic to shades.ts, add options to generate from r,g,b aswell
  static generateShades([h,s,l],count = 5) {
    const decrement = (l*100) / (count+1);
    return Array.from({ length: count }, (_, i) => {
      return `hsl(${Number.parseFloat(h).toFixed(2)}, ${Number.parseFloat(s * 100).toFixed(2)}%, ${(l*100 - decrement * (i+1)).toFixed(2)}%)`
    });
  }

  //TODO: move logic to tints.ts, add options to generate from r,g,b aswell
  static generateTints([h,s,l], count = 5) {
    const increment = (100 - l*100) / (count+1);
    return Array.from({ length: count }, (_, i) => {
      return `hsl(${Number.parseFloat(h).toFixed(2)}, ${Number.parseFloat(s * 100).toFixed(2)}%, ${(l*100 + increment * (i+1)).toFixed(2)}%)`
    });
  }

  //TODO: move function to hsl.ts utility file later when we bundle code
  static toHSL(u8) {
    let [r, g, b] = [u8[0], u8[1], u8[2]];

    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      return {
        data: [0, 0, l], // no saturation
        string: `hsl(0, 0%, ${Number.parseFloat(l * 100).toFixed(2)}%)`,
      };
    }

    const c = max - min;

    s = c / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = (g - b) / c + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / c + 2;
        break;
      case b:
        h = (r - g) / c + 4;
        break;
    }
    h *= 60; // scaling hue up

    return {
      data: [h, s, l],
      string: `hsl(${Number.parseFloat(h).toFixed(2)}, ${Number.parseFloat(s * 100).toFixed(2)}%, ${Number.parseFloat(l * 100).toFixed(2)}%)`,
    };
  }
}
