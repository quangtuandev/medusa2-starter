export const COLORS_MORPHING_SHAPE = {
  BLOSSOM: { colorStart: "#FFFFFF", colorEnd: "#6DCB8F", offsetStart: 8.85, offsetEnd: 79.19 },
  SAFFRON: { colorStart: "#BEB1F8", colorEnd: "#8F5DDB", offsetStart: 8.85, offsetEnd: 79.19 },
  HAZE: { colorStart: "#BFFAED", colorEnd: "#BBEE7C", offsetStart: 8.85, offsetEnd: 79.19 },
  RICE: { colorStart: "#EEF7FF", colorEnd: "#A2D4FD", offsetStart: 8.85, offsetEnd: 79.19 },
  LATTE: { colorStart: "#E4E3D8", colorEnd: "#89E4BB", offsetStart: 8.85, offsetEnd: 79.19 },
  COFFEE: { colorStart: "#F5DDDD", colorEnd: "#FFB578", offsetStart: 8.85, offsetEnd: 79.19 },
}

export const randomAssetMorphingShape = (colorType: keyof typeof COLORS_MORPHING_SHAPE | string | null = null) => {
  const colors = colorType ? COLORS_MORPHING_SHAPE[colorType as keyof typeof COLORS_MORPHING_SHAPE] : Object.values(COLORS_MORPHING_SHAPE);
  const color = Array.isArray(colors) ? colors[Math.floor(Math.random() * colors.length)] : colors;
  return {
    blur: 20,
    zoom: 0.42,
    className: 'flex justify-center',
    id: Math.random().toString(36).substring(2, 15),
    ...color
  };
};

export const getCustomizationTitles = (title: string) => {
  let str = title.trim()

  if (str.includes(' ')) {
    const [first, ...rest] = str.split(/\s+/)
    return [first, '_' + rest.join(' ')]
  }
  const mid = Math.floor(str.length / 2)
  const first = str.slice(0, mid)
  const last = str.slice(mid)
  return [first, '_' + last]
};