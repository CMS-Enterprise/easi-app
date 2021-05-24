import toCamelCase from './toCamelCase';

describe('toCamelCase', () => {
  it('converts from screaming snake case to camel case', () => {
    expect(toCamelCase('')).toEqual('');
    expect(toCamelCase('HELLO')).toEqual('hello');
    expect(toCamelCase('HELLO_AGAIN')).toEqual('helloAgain');
  });
});
