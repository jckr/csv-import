import { Header } from './csv-import';

const separators = [',', ';', '|', '\t', ' '];

export function splitWithSeparator(line: string, separator: string): string[] {
  const regex = new RegExp(
    `(".*?"|[^"${separator}\s]+)(?=\s*${separator}|\s*$)`,
    'g'
  );
  return line.match(regex) || [];
}

export function guessSeparator(firstLines: string[]) {
  if (firstLines.length === 0) {
    throw 'The file is empty';
  }
  const firstLine = firstLines[0];
  let separatorFound = false;
  for (const separator of separators) {
    if (firstLine.includes(separator)) {
      separatorFound = true;
      const nbColumnsInFirstLine = splitWithSeparator(
        firstLine,
        separator
      ).length;
      if (
        firstLines.slice(1).every((line) => {
          const nbColumns = splitWithSeparator(line, separator).length;
          return nbColumns === nbColumnsInFirstLine;
        })
      ) {
        return separator;
      }
    }
  }
  if (separatorFound) {
    // If the separator is found but the number of columns is not consistent,
    // we can't make any assumption about the separator
    throw 'The separator is not consistent';
  }
  // If no separator is found, the file has only one column
  return ',';
}

export function guessHeaderNames(firstLines: string[]) {
  const separator = guessSeparator(firstLines);
  const headerNames = splitWithSeparator(firstLines[0], separator).map(headerName => {
    const headerNameWithoutSpace = headerName.trim();
    if (headerNameWithoutSpace.startsWith('"') && headerNameWithoutSpace.endsWith('"')) {
      return headerNameWithoutSpace.slice(1, -1);
    }
    return headerNameWithoutSpace;
  });
  return headerNames.map(name => ({name, nullable: false, type: 'unknown'} as Header));
}
