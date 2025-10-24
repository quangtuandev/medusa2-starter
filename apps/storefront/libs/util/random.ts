export const randomAssetMorphingShape = () => {
  const colors = [
    { colorStart: "#FFFFFF", colorEnd: "#6DCB8F", offsetStart: 8.85, offsetEnd: 79.19 },
    { colorStart: "#BEB1F8", colorEnd: "#8F5DDB", offsetStart: 8.85, offsetEnd: 79.19 },
    { colorStart: "#BFFAED", colorEnd: "#BBEE7C", offsetStart: 8.85, offsetEnd: 79.19 },
    { colorStart: "#EEF7FF", colorEnd: "#A2D4FD", offsetStart: 8.85, offsetEnd: 79.19 },
    { colorStart: "#E4E3D8", colorEnd: "#89E4BB", offsetStart: 8.85, offsetEnd: 79.19 },
    { colorStart: "#F5DDDD", colorEnd: "#FFB578", offsetStart: 8.85, offsetEnd: 79.19 },

  ];

  return {
    blur: 20,
    zoom: 0.42,
    className: 'flex justify-center',
    id: Math.random().toString(36).substring(2, 15),
    ...colors[Math.floor(Math.random() * colors.length)],
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