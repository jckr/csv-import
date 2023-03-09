const MAX_EPOCH_TIMESTAMP = 2147483640;
const MAX_EPOCH_TIMESTAMP_MS = MAX_EPOCH_TIMESTAMP * 1000;
import { CsvType } from './csv-import';
type DataRowsReducer = {
  nullable: boolean;
  isNumeric: boolean;
  maxLength: number;
};

export type InferData = {
  nullable: boolean;
  type: CsvType;
}

export function inferData(datarows: string[][], columnIndex: number): InferData {
  let type = 'unknown';

  const { nullable, isNumeric, maxLength } = datarows.reduce(
    (acc: DataRowsReducer, row: string[]) => {
      const value = row[columnIndex];
      if (value === '') {
        acc.nullable = true;
      }
      if (isNaN(Number(value))) {
        acc.isNumeric = false;
      }
      const maxLength = Math.max(acc.maxLength, value.length);
      return { ...acc, maxLength };
    },
    { nullable: false, isNumeric: true, maxLength: 0 }
  );

  if (isNumeric) {
    // if number has fractional value, it's real
    if (
      checkPredicate(
        datarows,
        columnIndex,
        (value) => Number(value) % 1 !== 0,
        'any'
      )
    ) {
      return { nullable, type: 'REAL' };
    }
    // numbers don't have fractional parts.
    if (maxLength > 10) {
      if (
        checkPredicate(datarows, columnIndex, (value) => {
          const n = Number(value);
          return n > 1e9 && n < MAX_EPOCH_TIMESTAMP;
        })
      ) {
        return { nullable, type: 'TIMESTAMP' };
      }

      if (
        checkPredicate(datarows, columnIndex, (value) => {
          const n = Number(value);
          return n > 1e12 && n < MAX_EPOCH_TIMESTAMP_MS;
        })
      ) {
        return { nullable, type: 'TIMESTAMP' };
      }
      if (
        checkPredicate(
          datarows,
          columnIndex,
          (value) => {
            const b = BigInt(value);
            return b > 2 ** 31 || b < -(2 ** 31);
          },
          'any'
        )
      ) {
        return { nullable, type: 'BIGINT' };
      }

      return { nullable, type: 'INTEGER' };
    }
    if (maxLength < 4) {
      if (
        checkPredicate(datarows, columnIndex, (value) => {
          const n = Number(value);
          return n >= 0 && n < 256;
        })
      ) {
        return { nullable, type: 'TINYINT' };
      }
      if (
        checkPredicate(datarows, columnIndex, (value) => {
          const n = Number(value);
          return n > -129 && n < 128;
        })
      ) {
        return { nullable, type: 'TINYINT' };
      }
      return { nullable, type: 'SMALLINT' };
    }

    if (maxLength < 6) {
      if (
        checkPredicate(datarows, columnIndex, (value) => {
          const n = Number(value);
          return n >= 0 && n < 65536;
        })
      ) {
        return { nullable, type: 'SMALLINT' };
      }
      if (
        checkPredicate(datarows, columnIndex, (value) => {
          const n = Number(value);
          return n > -32769 && n < 32768;
        })
      ) {
        return { nullable, type: 'SMALLINT' };
      }
    }
    return { nullable, type: 'INTEGER' };
  }
  // values are not all numbers.

  if (maxLength <= 5) {
    if (checkPredicate(datarows, columnIndex, (value) => value === 'true' || value === 'false')) {
      return { nullable, type: 'BOOLEAN' };
    }
  }

  if (maxLength === 10) {
    if (
      checkPredicate(datarows, columnIndex, (value) => {
        // matches YYYY-MM-DD with 1000 <= YYYY <= 9999
        return (
          value.match(
            /^(?!0000)[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
          ) !== null
        );
      })
    ) {
      return { nullable, type: 'DATE' };
    }
  }

  if (maxLength === 17) {
    if (
      checkPredicate(datarows, columnIndex, (value) => {
        // matches YYYY-MM-DD HH:MM:SS with 1000 <= YYYY <= 9999
        return (
          value.match(
            /^(?!0000)[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
          ) !== null
        );
      })
    ) {
      return { nullable, type: 'DATETIME' };
    }
  }

  return { nullable, type: 'TEXT' };
}

function checkPredicate(
  dataRows: string[][],
  columnIndex: number,
  predicate: (value: string) => boolean,
  mode: 'all' | 'any' = 'all'
) {
  if (mode === 'all') {
    return dataRows.every((row) => {
      const value = row[columnIndex];
      return value === '' || predicate(value);
    });
  }
  return dataRows.some((row) => {
    const value = row[columnIndex];
    return value !== '' && predicate(value);
  });
}
