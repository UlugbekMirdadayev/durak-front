const useSizeCalculator = (size) => {
  const array = typeof size === "object" && size.length ? size : [size];
  const isMobile = window.innerHeight / window.innerWidth >= 1.5;
  return array
    .map((size) => {
      if (isNaN(size)) return size;
      return isMobile ? `${(size / 375) * 100}vw` : `${size}px`;
    })
    .join(" ");
};

export default useSizeCalculator;
