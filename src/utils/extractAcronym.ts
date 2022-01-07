// Extracts acronym of only capitalized words in string
const extractAcronym = (words: string) => {
  const acroynm = words
    .split(' ')
    .filter(
      str =>
        str?.[0] &&
        str[0] === str[0].toUpperCase() &&
        str[0] !== str[0].toLowerCase() &&
        str[0]
    )
    .map(str => str?.[0]);

  return acroynm;
};

export default extractAcronym;
