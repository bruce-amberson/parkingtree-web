import { startCase, lowerCase, toLower, toUpper } from 'lodash';

function splitWords(text, separator, ignoreWords) {
  const formattedIgnoreWords = ignoreWords.map(ignoreWord => toLower(ignoreWord));
  return text.split(separator)
    .map(word => {
      const wordIndex = formattedIgnoreWords.indexOf(toLower(word));
      return wordIndex > -1 ? ignoreWords[wordIndex] : toUpper(word.charAt(0)) + word.slice(1);
    })
    .join(separator);
}

export function properCase(text, ignoreWords = []) {
  const allIgnoreWords = ['LLC', 'LLC.', 'LP', 'I', 'II', 'III', 'IV', 'V', ...ignoreWords];
  if (text === null) {
    return '';
  }
  else if (!text.match(/[\s-"]/)) {
    return startCase(lowerCase(text));
  }
  else if (!text.match(/[-"]/)) {
    return splitWords(toLower(text), ' ', allIgnoreWords);
  }
  else {
    const spaceSplit = splitWords(toLower(text), ' ', allIgnoreWords);
    const dashSplit = splitWords(spaceSplit, '-', allIgnoreWords);
    const doubleQuoteSplit = splitWords(dashSplit, '"', allIgnoreWords);

    return doubleQuoteSplit;
  }
}
