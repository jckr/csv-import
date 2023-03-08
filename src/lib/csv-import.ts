import {guessHeaderNames} from './detect-headers';

type Value = string | number | null;
export type Header = {
  name: string;
  nullable: boolean;
  type: 'string' | 'number' | 'null' | 'unknown';
}

type csv = {
  data: Value[][];
  headers: Header[];
}

export const csvImport = (raw: string): csv => {
  const rows = raw.split('\n');
  if (rows.length === 0) {throw('The file is empty');}
  const headers = guessHeaderNames(rows.slice(0, 5));

  return {
    data: [] as Value[][],
    headers,
  };
}