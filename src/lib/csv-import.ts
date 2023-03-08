type Value = string | number | null;
type Header = {
  name: string;
  nullable: boolean;
  type: 'string' | 'number' | 'null' | 'unknown';
}

type csv = {
  data: Value[][];
  headers: Header[];
}

export const csvImport = (raw: string): csv => {

  return {
    data: [] as Value[][],
    headers: [] as Header[],
  };
}