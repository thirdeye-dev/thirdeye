export const toSentenceCase = (str: string) => {
  const words = str.split("_");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return capitalizedWords.join(" ");
};

export const getColorByTag = (tag: string) => {
  switch (tag) {
    case "success":
      return "green";
    case "warn":
      return "yellow";
    case "error":
      return "red";
    default:
      return "gray";
  }
};
