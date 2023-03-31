import { cleanCSVData } from './csv';

describe('cleanCSVData', () => {
  it('returns null if passed null', () => {
    expect(cleanCSVData(null)).toBeNull();
  });

  it('returns the same value if passed a boolean', () => {
    expect(cleanCSVData(true)).toBe(true);
    expect(cleanCSVData(false)).toBe(false);
  });

  it('returns the same value if passed a number', () => {
    expect(cleanCSVData(5)).toBe(5);
    expect(cleanCSVData(1)).toBe(1);
    expect(cleanCSVData(0)).toBe(0);
    expect(cleanCSVData(-1)).toBe(-1);
  });

  it('cleans strings', () => {
    expect(cleanCSVData('hello')).toBe('hello');
    expect(cleanCSVData('hello+world')).toBe('hello\\+world');
    expect(cleanCSVData('hello=world')).toBe('hello\\=world');
    expect(cleanCSVData('hello+world=')).toBe('hello\\+world\\=');
  });

  it('cleans arrays', () => {
    expect(cleanCSVData(['hello', 'world'])).toEqual(['hello', 'world']);
    expect(cleanCSVData(['hello+world', 'hello=world'])).toEqual([
      'hello\\+world',
      'hello\\=world'
    ]);
  });

  it('cleans objects', () => {
    expect(cleanCSVData({ hello: 'world' })).toEqual({ hello: 'world' });
    expect(cleanCSVData({ hello: 'world+foo' })).toEqual({
      hello: 'world\\+foo'
    });
  });

  it('cleans nested objects', () => {
    expect(cleanCSVData({ hello: { world: 'foo' } })).toEqual({
      hello: { world: 'foo' }
    });
    expect(cleanCSVData({ hello: { world: 'foo+bar' } })).toEqual({
      hello: { world: 'foo\\+bar' }
    });
    // cleans an object with an array in it
    expect(cleanCSVData({ hello: { world: ['foo', '+bar'] } })).toEqual({
      hello: { world: ['foo', '\\+bar'] }
    });
  });
});
