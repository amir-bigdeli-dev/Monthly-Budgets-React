const ColorGenerator = () => {
  const R = Math.floor(Math.random() * 255);
  const G = Math.floor(Math.random() * 245);
  const B = Math.floor(Math.random() * 240);
  const A = 0.5;
  return `rgba(${R}, ${G}, ${B},${A})`;
};

export default ColorGenerator;
