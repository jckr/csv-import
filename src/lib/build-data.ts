import {Value, Header, CsvType} from './csv-import';

export function buildData(dataRows: string[][], headers: Header[]): Value[][] {
  return dataRows.map(row => {
    return row.map((value, i) => {
      const header = headers[i];
      if (value === '') {
        return null;
      }
      switch (header.type) {
        case 'TEXT':
          return value;
        case 'DATE':
          return value;
        case 'DATETIME':
          return value;
        case 'TIMESTAMP':
          return value;
        case 'SMALLINT':
          return Number(value);
        case 'INTEGER':
          return Number(value);
        case 'BIGINT':
          return value;
        case 'REAL':
          return Number(value);
        case 'TINYINT':
          return Number(value);
        case 'BOOLEAN':
          return value === 'true';
        default:
          throw new Error(`Unknown type ${header.type}`);
      }
    });
  });
}