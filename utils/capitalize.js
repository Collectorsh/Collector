export function capitalize(sentence) {
  const words = sentence.split(" ");
  words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
  return words;
}
