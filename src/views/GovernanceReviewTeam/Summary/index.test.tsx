import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import { DateTime } from 'luxon';

import Summary from '.';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

const INTAKE_ID = 'ccdfdcf5-5085-4521-9f77-fa1ea324502b';

describe('The GRT Review page', () => {
  it('shows open status', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Summary
            id={INTAKE_ID}
            requester={{
              name: 'John Doe',
              component: 'Office of Information Technology'
            }}
            requestName="Request Name"
            requestType="NEW"
            status="INTAKE_SUBMITTED"
            adminLead={null}
            submittedAt={DateTime.local()}
            lcid={null}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('grt-status')).getByText('Open')
    ).toBeInTheDocument();
  });

  it('shows closed status', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Summary
            id={INTAKE_ID}
            requester={{
              name: 'John Doe',
              component: 'Office of Information Technology'
            }}
            requestName="Request Name"
            requestType="NEW"
            status="LCID_ISSUED"
            adminLead={null}
            submittedAt={DateTime.local()}
            lcid={null}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('grt-status')).getByText('Closed')
    ).toBeInTheDocument();
  });

  it('shows lifecycle id if it exists', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Summary
            id={INTAKE_ID}
            requester={{
              name: 'John Doe',
              component: 'Office of Information Technology'
            }}
            requestName="Request Name"
            requestType="NEW"
            status="LCID_ISSUED"
            adminLead={null}
            submittedAt={DateTime.local()}
            lcid="123456"
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('grt-lcid')).getByText('123456')
    ).toBeInTheDocument();
  });
});
