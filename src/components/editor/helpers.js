export function chunkArr(arr, size = 2) {
  if (size < 1) {
    throw new Error('Invalid chunk size: ' + size);
  }
  if (size === 1) {
    return arr.map(el => [el]);
  }
  const chunks = [];
  const chunksAmount = Math.ceil(arr.length / size);
  for (let i = 0, offset = 0; i < chunksAmount; i++) {
    chunks.push(arr.slice(offset, offset + size));
    offset += size;
  }
  return chunks;
}

export function chunkString(str, size = 2) {
  return chunkArr([...str], size).map(chunk => chunk.join(''));
}

export function rgbToHSL(color) {
  const { r, g, b } = toFloatRGBA(color);
  const rgb = [r, g, b];
  let min = rgb[0], max = rgb[0], l, s, maxcolor = 0, h;
  for (let i = 0; i < rgb.length - 1; i++) {
    if (rgb[i + 1] <= min) {
      min = rgb[i + 1];
    }
    if (rgb[i + 1] >= max) {
      max = rgb[i + 1];
      maxcolor = i + 1;
    }
  }
  if (maxcolor === 0) {
    h = (rgb[1] - rgb[2]) / (max - min);
  }
  if (maxcolor === 1) {
    h = 2 + (rgb[2] - rgb[0]) / (max - min);
  }
  if (maxcolor === 2) {
    h = 4 + (rgb[0] - rgb[1]) / (max - min);
  }
  if (isNaN(h)) {
    h = 0;
  }
  h = h * 60;
  if (h < 0) {
    h = h + 360;
  }
  l = (min + max) / 2;
  if (min === max) {
    s = 0;
  } else {
    if (l < 0.5) {
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2 - max - min);
    }
  }
  return { h, s, l };
}

export function hslToRGB({ h, s, l }) {
  let t1, t2, r, g, b;
  h = h / 60;
  if (l <= 0.5) {
    t2 = l * (s + 1);
  } else {
    t2 = l + s - (l * s);
  }
  t1 = l * 2 - t2;
  r = Math.round(hueToRGB(t1, t2, h + 2) * 255);
  g = Math.round(hueToRGB(t1, t2, h) * 255);
  b = Math.round(hueToRGB(t1, t2, h - 2) * 255);
  return { r, g, b };
}

export function hueToRGB(t1, t2, hue) {
  if (hue < 0) {
    hue += 6;
  }
  if (hue >= 6) {
    hue -= 6;
  }
  if (hue < 1) {
    return (t2 - t1) * hue + t1;
  } else if (hue < 3) {
    return t2;
  } else if (hue < 4) {
    return (t2 - t1) * (4 - hue) + t1;
  } else {
    return t1;
  }
}

export function hexToRGBA(hex) {
  const [r, g, b, a] = chunkString(hex.trim().replace(/^#/, ''), 2).map(el => parseInt(el, 16));
  return { r, g, b, a: isNaN(+a) ? 255 : a };
}

export function rgbToHEX({ r, g, b, a = 1 }, addOpacity = false) {
  const hex = [r, g, b].map(el => el.toString(16).padStart(2, '0'));
  if (addOpacity) {
    hex.push(a.toString(16).padStart(2, '0'));
  }
  return `#${hex.join('')}`;
}

export function hexToHSL(hex) {
  return rgbToHSL(hexToRGBA(hex));
}

export function hslToHex({ h, s, l }) {
  return rgbToHEX(hslToRGB({ h, s, l }));
}

export const NOT_A_COLOR = -1;
export const COLOR_TYPE_HEX = 0;
export const COLOR_TYPE_HEXA = 1;
export const COLOR_TYPE_RGB = 2;
export const COLOR_TYPE_RGBA = 3;
export const COLOR_TYPE_HSL = 4;
export const COLOR_TYPE_HSLA = 5;
export const COLOR_TYPE_HSV = 6;
export const COLOR_TYPE_HSVA = 7;

const regExps = {
  [COLOR_TYPE_HEX]: /#([\da-f]{3}|[\da-f]{6})/i,
  [COLOR_TYPE_HEXA]: /#([\da-f]{4}|[\da-f]{8})/i,
  [COLOR_TYPE_RGB]: /rgb\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\)/i,
  [COLOR_TYPE_RGBA]: /rgba\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*([01]|0\.\d+)\)/i,
  [COLOR_TYPE_HSL]: /hsl\(\d+(deg)?\s*,\s*\s*\d+%\s*,\s*\d+%\)/i,
  [COLOR_TYPE_HSLA]: /hsla\(\d+(deg)?\s*,\s*\s*\d+%\s*,\s*\d+%\s*,\s*([01]|0\.\d+)\)/i,
  [COLOR_TYPE_HSV]: /hsv\(\d+(deg)?\s*,\s*\s*\d+%\s*,\s*\d+%\)/i,
  [COLOR_TYPE_HSVA]: /hsva\(\d+(deg)?\s*,\s*\s*\d+%\s*,\s*\d+%\s*,\s*([01]|0\.\d+)\)/i,
};

export function isHEXColor(color) {
  return regExps[COLOR_TYPE_HEX].test(color);
}

export function isHEXAColor(color) {
  return regExps[COLOR_TYPE_HEXA].test(color);
}

export function isRRBColor(color) {
  return regExps[COLOR_TYPE_RGB].test(color);
}

export function isRRBAColor(color) {
  return regExps[COLOR_TYPE_RGBA].test(color);
}

export function isHSLColor(color) {
  return regExps[COLOR_TYPE_HSL].test(color);
}

export function isHSLAColor(color) {
  return regExps[COLOR_TYPE_HSLA].test(color);
}

export function isHSVColor(color) {
  return regExps[COLOR_TYPE_HSV].test(color);
}

export function isHSVAColor(color) {
  return regExps[COLOR_TYPE_HSVA].test(color);
}

export function detectColor(color) {
  if (isHEXColor(color)) {
    return COLOR_TYPE_HEX;
  }
  if (isHEXAColor(color)) {
    return COLOR_TYPE_HEXA;
  }
  if (isRRBColor(color)) {
    return COLOR_TYPE_RGB;
  }
  if (isRRBAColor(color)) {
    return COLOR_TYPE_RGBA;
  }
  if (isHSLColor(color)) {
    return COLOR_TYPE_HSL;
  }
  if (isHSLAColor(color)) {
    return COLOR_TYPE_HSLA;
  }
  if (isHSVColor(color)) {
    return COLOR_TYPE_HSV;
  }
  if (isHSVAColor(color)) {
    return COLOR_TYPE_HSVA;
  }
  return NOT_A_COLOR;
}

export function rgbToHSV(color) {
  const { r, g, b, a } = toFloatRGBA(color);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const s = max === 0 ? 0 : 1 - min / max;
  let h = 0;
  const dif = max - min;
  if (dif === 0) {
    h = 0;
  } else if (max === r && g >= b) {
    h = 60 * ((g - b) / dif);
  } else if (max === r && g < b) {
    h = 60 * ((g - b) / dif) + 360;
  } else if (max === g) {
    h = 60 * ((b - r) / dif) + 120;
  } else if (max === b) {
    h = 60 * ((r - g) / dif) + 240;
  }
  return { h: Math.round(h), s: +s.toFixed(2), v: +max.toFixed(2), a };
}

export function hsvToRGB({ h, s, v, a }) {
  const C = v * s;
  const X = C * (1.0 - Math.abs((h / 60 % 2) - 1.0));
  const m = v - C;
  const [r, g, b] = [
    [C, X, 0], // H' [0, 60)
    [X, C, 0], // H' [60, 120)
    [0, C, X], // H' [120, 180)
    [0, X, C], // H' [180, 240)
    [X, 0, C], // H' [240, 300)
    [C, 0, X], // H' [300, 360)
  ][~~((h === 360 ? 0 : h) / 60)];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: a === void 0 ? 1 : a
  };
}

export function hsvToHEX(color) {
  return rgbToHEX(hsvToRGB(color));
}

function toFloatRGBA(color) {
  let rgb;
  if (Array.isArray(color)) {
    const [r, g, b, a] = color;
    rgb = { r, g, b, a: a === void 0 ? 1 : a };
  } else if (color !== null && typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
    const { r, g, b, a } = color;
    rgb = { r, g, b, a: a === void 0 ? 1 : a };
  } else if (typeof color === 'string') {
    const type = detectColor(color);
    if (type === COLOR_TYPE_HEX || color === COLOR_TYPE_HEXA) {
      rgb = hexToRGBA(color);
    }
  }
  if (rgb === void 0) {
    throw new Error('Can not parse color');
  }
  const [r, g, b, a] = [rgb.r / 255, rgb.g / 255, rgb.b / 255, rgb.a / 255];
  return { r, g, b, a };
}

export function bounded(num = 0, low = 0, high = 1) {
  const _low = Math.min(low, high);
  const _high = Math.max(low, high);
  if (num < _low) {
    return _low;
  }
  if (num > _high) {
    return _high;
  }
  return num;
}
