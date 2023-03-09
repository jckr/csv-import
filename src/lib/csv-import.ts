import { buildData } from './build-data';
import {guessHeaderNames, guessSeparator, splitWithSeparator} from './detect-headers';
import { inferData } from './infer-data';

export type Value = string | number | boolean | null;
export type CsvType = 'TEXT' | 'DATE' | 'DATETIME' | 'TIMESTAMP' | 'SMALLINT' | 'INTEGER' | 'BIGINT' | 'REAL' | 'TINYINT' | 'BOOLEAN';
export type Header = {
  name: string;
  nullable: boolean;
  type: CsvType;
}

type csv = {
  data: Value[][];
  headers: Header[];
}

export const csvImport = (raw: string): csv => {
  const rows = raw.split('\n');
  if (rows.length === 0) {throw('The file is empty');}
  const first5Rows = rows.slice(0, 5);
  const separator = guessSeparator(first5Rows)
  const headersNames = guessHeaderNames(first5Rows, separator);
  const headers = [] as Header[];
  const dataRows = rows.slice(1).map(row => splitWithSeparator(row, separator));
  for (let i = 0; i < headers.length; i++) {
    const {nullable, type} = inferData(dataRows, i);
    headers.push({name: headersNames[i], nullable, type});
  }

  const data = buildData(dataRows, headers);

  return {
    data,
    headers,
  };
}