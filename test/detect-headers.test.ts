import { guessHeaderNames, guessSeparator } from './../src/lib/detect-headers';

const FILE_WITH_COMMA_SEPARATOR = `id,name,age
1,John,30
2,Paul,40
3,George,50
4,Ringo,60`.split('\n');

const FILE_WITH_COMMAS_INSIDE_QUOTES_BAD = `id,name,age
1,"John, 30"
2,"George, 40"`.split('\n');

const FILE_WITH_COMMAS_INSIDE_QUOTES_GOOD = `id,name,age
1,"John, the first",30
2,"George",40`.split('\n');

const FILE_WITH_PIPE_SEPARATOR = `id|name|age
1|John|30
2|Paul|40
3|George|50
4|Ringo|60`.split('\n');

const FILE_WITH_TAB_SEPARATOR = `id\tname\tage
1\tJohn\t30
2\tPaul\t40
3\tGeorge\t50
4\tRingo\t60`.split('\n');

const FILE_WITH_SEMICOLON_SEPARATOR = `id;name;age
1;John;30
2;Paul;40
3;George;50
4;Ringo;60`.split('\n');

const FILE_WITH_SPACE_SEPARATOR = `id name age
1 John 30
2 Paul 40
3 George 50
4 Ringo 60`.split('\n');

const FILE_WITH_INCONSISTENT_SEPARATOR = `id,name;age
1;John;30
2,Paul|40
3;George,50
4,Ringo|60`.split('\n');

const FILE_WITH_ONE_COLUMN = `id
1
2
3`.split('\n');

const headers = [
  { name: 'id', nullable: false, type: 'unknown' },
  { name: 'name', nullable: false, type: 'unknown' },
  { name: 'age', nullable: false, type: 'unknown' },
];

describe('it finds the correct separator in a csv file', () => {
  it('detects comma separator', () => {
    expect(guessSeparator(FILE_WITH_COMMA_SEPARATOR)).toBe(',');
  });
  it('detects pipe separator', () => {
    expect(guessSeparator(FILE_WITH_PIPE_SEPARATOR)).toBe('|');
  });
  it('detects tab separator', () => {
    expect(guessSeparator(FILE_WITH_TAB_SEPARATOR)).toBe('\t');
  });
  it('detects semicolon separator', () => {
    expect(guessSeparator(FILE_WITH_SEMICOLON_SEPARATOR)).toBe(';');
  });
  it('detects space separator', () => {
    expect(guessSeparator(FILE_WITH_SPACE_SEPARATOR)).toBe(' ');
  });
  it('throws with empty file', () => {
    try {
      guessSeparator([]);
    } catch (e) {
      expect(e).toBe('The file is empty');
    }
  });
  it('throws with inconsistent file', () => {
    try {
      expect(guessSeparator(FILE_WITH_INCONSISTENT_SEPARATOR)).toThrow();
    } catch (e) {
      expect(e).toBe('The separator is not consistent');
    }
  });
  it('handles separators inside quotes', () => {
    expect(guessSeparator(FILE_WITH_COMMAS_INSIDE_QUOTES_GOOD)).toBe(',');
    try {
      expect(guessSeparator(FILE_WITH_COMMAS_INSIDE_QUOTES_BAD)).toThrow();
    } catch (e) {
      expect(e).toBe('The separator is not consistent');
    }
  });
  it('handles file with one column', () => {
    expect(guessSeparator(FILE_WITH_ONE_COLUMN)).toBe(',');
  });
});

describe('it finds the correct header names in a csv file', () => {
  it('finds the right header names in the separator examples', () => {
    [
      FILE_WITH_COMMA_SEPARATOR,
      FILE_WITH_PIPE_SEPARATOR,
      FILE_WITH_TAB_SEPARATOR,
      FILE_WITH_SEMICOLON_SEPARATOR,
      FILE_WITH_SPACE_SEPARATOR,
    ].forEach((file) => {
      expect(guessHeaderNames(file)).toEqual(headers);
    });
    expect(guessHeaderNames(FILE_WITH_ONE_COLUMN)).toEqual(headers.slice(0,1));
  });
});
