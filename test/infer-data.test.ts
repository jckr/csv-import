import { inferData } from '../src/lib/infer-data';

const HAS_EMPTY_CELLS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '', '9'],
];

const HAS_TIMESTAMPS = [
  ['1678331076', '1678331076000', '1678331076'],
  ['1678331083', '1678331083000', '1678331083000'],
  ['1678331088', '1678331088000', '91678331088']
]

describe('it infers the correct type for a column', () => {
  it('infers the correct type for a column with empty cells', () => {
    const firstColumn = inferData(HAS_EMPTY_CELLS, 0);
    expect(firstColumn.type).toBe('TINYINT');
    expect(firstColumn.nullable).toBe(false);
    const secondColumn = inferData(HAS_EMPTY_CELLS, 1);
    expect(secondColumn.type).toBe('TINYINT');
    expect(secondColumn.nullable).toBe(true);
  });
  it('infers the correct type for a column with timestamps', () => {
    const firstColumn = inferData(HAS_TIMESTAMPS, 0);
    // expect(firstColumn.type).toBe('TIMESTAMP');
    expect(firstColumn.nullable).toBe(false);
    const secondColumn = inferData(HAS_TIMESTAMPS, 1);
    expect(secondColumn.type).toBe('TIMESTAMP');
    expect(secondColumn.nullable).toBe(false);
    const thirdColumn = inferData(HAS_TIMESTAMPS, 2);
    expect(thirdColumn.type).toBe('BIGINT');
    expect(thirdColumn.nullable).toBe(false);
  });
});
