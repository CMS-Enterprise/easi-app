import React from 'react';
import { render, screen } from '@testing-library/react';

import SafeCSVLink from '.';

const { csvLinkPropsSpy } = vi.hoisted(() => ({
  csvLinkPropsSpy: vi.fn()
}));

vi.mock('react-csv', () => ({
  CSVLink: ({ children, ...props }: any) => {
    csvLinkPropsSpy({ children, ...props });
    return <a href="#download">{children}</a>;
  }
}));

describe('SafeCSVLink', () => {
  const webservicePayload =
    '@WEBSERVICE(CHAR(104)&CHAR(116)&CHAR(116)&CHAR(112)&CHAR(115)&CHAR(58)&CHAR(47)&CHAR(47)&CHAR(119)&CHAR(119)&CHAR(119)&CHAR(46)&CHAR(103)&CHAR(111)&CHAR(111)&CHAR(103)&CHAR(108)&CHAR(101)&CHAR(46)&CHAR(99)&CHAR(111)&CHAR(109))';

  beforeEach(() => {
    csvLinkPropsSpy.mockClear();
  });

  it('passes spreadsheet-safe object data to CSVLink', () => {
    render(
      <SafeCSVLink
        data={[
          {
            requestName: webservicePayload,
            businessNeed: 'hello+world'
          }
        ]}
        filename="requests.csv"
      >
        Download requests
      </SafeCSVLink>
    );

    expect(
      screen.getByRole('link', { name: 'Download requests' })
    ).toBeInTheDocument();

    const props = csvLinkPropsSpy.mock.calls[0][0];

    expect(props.data).toEqual([
      {
        requestName: `'${webservicePayload}`,
        businessNeed: 'hello+world'
      }
    ]);
    expect(props.filename).toBe('requests.csv');
  });

  it('passes spreadsheet-safe row data to CSVLink', () => {
    render(
      <SafeCSVLink
        data={[
          ['Request Name', 'Business Need'],
          [webservicePayload, '\t=SUM(1,1)'],
          ['hello+world', 'hello=world']
        ]}
        filename="requests.csv"
      >
        Download requests
      </SafeCSVLink>
    );

    const props = csvLinkPropsSpy.mock.calls[0][0];

    expect(props.data).toEqual([
      ['Request Name', 'Business Need'],
      [`'${webservicePayload}`, "'\t=SUM(1,1)"],
      ['hello+world', 'hello=world']
    ]);
  });
});
