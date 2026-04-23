import cleanCSVData from './csv';

describe('cleanCSVData', () => {
  const webservicePayload =
    '@WEBSERVICE(CHAR(104)&CHAR(116)&CHAR(116)&CHAR(112)&CHAR(115)&CHAR(58)&CHAR(47)&CHAR(47)&CHAR(119)&CHAR(119)&CHAR(119)&CHAR(46)&CHAR(103)&CHAR(111)&CHAR(111)&CHAR(103)&CHAR(108)&CHAR(101)&CHAR(46)&CHAR(99)&CHAR(111)&CHAR(109))';
  const calculatorPayload = "-1-rundll32|'URL.dll,OpenURL calc'!A";

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

  it('leaves benign strings unchanged', () => {
    expect(cleanCSVData('hello')).toBe('hello');
    expect(cleanCSVData('hello+world')).toBe('hello+world');
    expect(cleanCSVData('hello=world')).toBe('hello=world');
    expect(cleanCSVData('hello-world')).toBe('hello-world');
    expect(cleanCSVData('hello@world')).toBe('hello@world');
  });

  it('neutralizes cells that start with dangerous spreadsheet prefixes', () => {
    expect(cleanCSVData('=SUM(1,1)')).toBe("'=SUM(1,1)");
    expect(cleanCSVData('+SUM(1,1)')).toBe("'+SUM(1,1)");
    expect(cleanCSVData('-SUM(1,1)')).toBe("'-SUM(1,1)");
    expect(cleanCSVData('@SUM(1,1)')).toBe("'@SUM(1,1)");
    expect(cleanCSVData(webservicePayload)).toBe(`'${webservicePayload}`);
    expect(cleanCSVData(calculatorPayload)).toBe(`'${calculatorPayload}`);
  });

  it('neutralizes cells with leading whitespace before a spreadsheet prefix', () => {
    expect(cleanCSVData(' =SUM(1,1)')).toBe("' =SUM(1,1)");
    expect(cleanCSVData('\t=SUM(1,1)')).toBe("'\t=SUM(1,1)");
    expect(cleanCSVData('\n=SUM(1,1)')).toBe("'\n=SUM(1,1)");
    expect(cleanCSVData('\r=SUM(1,1)')).toBe("'\r=SUM(1,1)");
  });

  it('escapes embedded double quotes for CSV output', () => {
    expect(cleanCSVData('hello "world"')).toBe('hello ""world""');
  });

  it('cleans arrays recursively', () => {
    expect(cleanCSVData(['hello', 'world'])).toEqual(['hello', 'world']);
    expect(cleanCSVData(['hello+world', webservicePayload, '+bar'])).toEqual([
      'hello+world',
      `'${webservicePayload}`,
      "'+bar"
    ]);
  });

  it('cleans objects recursively', () => {
    expect(cleanCSVData({ hello: 'world' })).toEqual({ hello: 'world' });
    expect(
      cleanCSVData({ hello: webservicePayload, safe: 'world+foo' })
    ).toEqual({
      hello: `'${webservicePayload}`,
      safe: 'world+foo'
    });
  });

  it('cleans nested objects recursively', () => {
    expect(cleanCSVData({ hello: { world: 'foo' } })).toEqual({
      hello: { world: 'foo' }
    });
    expect(
      cleanCSVData({
        hello: {
          world: '\t=SUM(1,1)',
          notes: ['foo', '+bar']
        }
      })
    ).toEqual({
      hello: {
        world: "'\t=SUM(1,1)",
        notes: ['foo', "'+bar"]
      }
    });
  });
});
