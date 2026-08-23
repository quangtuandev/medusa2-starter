export const COLORS_MORPHING_SHAPE = {
  BLOSSOM: { colorStart: "#FFFFFF", colorEnd: "#6DCB8F" },
  SAFFRON: { colorStart: "#BEB1F8", colorEnd: "#8F5DDB" },
  HAZE: { colorStart: "#BFFAED", colorEnd: "#BBEE7C" },
  RICE: { colorStart: "#EEF7FF", colorEnd: "#A2D4FD" },
  LATTE: { colorStart: "#E4E3D8", colorEnd: "#89E4BB" },
  COFFEE: { colorStart: "#F5DDDD", colorEnd: "#FFB578" },
}

export const randomAssetMorphingShape = (colorType: keyof typeof COLORS_MORPHING_SHAPE | string | null = null) => {
  const colors = colorType && COLORS_MORPHING_SHAPE[colorType as keyof typeof COLORS_MORPHING_SHAPE]
    ? COLORS_MORPHING_SHAPE[colorType as keyof typeof COLORS_MORPHING_SHAPE]
    : Object.values(COLORS_MORPHING_SHAPE);
  const color = Array.isArray(colors) ? colors[Math.floor(Math.random() * colors.length)] : colors;
  return {
    blur: 20,
    zoom: 0.42,
    className: 'flex justify-center',
    id: Math.random().toString(36).substring(2, 15),
    ...color
  };
};

export const getProductMorphingShape = (product?: any) => {
  const customShape = product?.metadata?.morphing_shape;
  if (customShape && typeof customShape === 'object') {
    const { colorStart, colorEnd } = customShape;
    if (colorStart && colorEnd) {
      return {
        blur: 20,
        zoom: 0.42,
        className: 'flex justify-center',
        id: `product-shape-${product?.id || Math.random()}`,
        colorStart,
        colorEnd,
      };
    }
  }
  return randomAssetMorphingShape(product?.subtitle);
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