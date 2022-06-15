import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';

import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import GetSystemProfileQuery from 'queries/GetSystemProfileQuery';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import SystemProfile from './index';

const mocks = [
  {
    request: {
      query: GetCedarSystemQuery,
      variables: {
        id: '326-9-0'
      }
    },
    result: {
      data: {
        cedarSystem: mockSystemInfo[3]
      }
    }
  }
];

describe('The making a request page', () => {
  /*
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/systems/326-9-0/tools-and-software']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Medicare Beneficiary Contact Center')
      ).toBeInTheDocument();
    });
  });
  */

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/326-9-0/tools-and-software']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe('System profile description is expandable', () => {
  beforeEach(() => {
    // Fill in heights for description text element
    // https://github.com/testing-library/react-testing-library/issues/353
    const el = HTMLElement.prototype;
    Object.defineProperty(el, 'offsetHeight', {
      configurable: true,
      value: 300
    });
    Object.defineProperty(el, 'scrollHeight', {
      configurable: true,
      value: 400
    });
  });

  it('shows read more & less', async () => {
    const query = {
      request: {
        query: GetSystemProfileQuery,
        variables: {
          id: '000-100-0'
        }
      },
      result: {
        data: {
          cedarAuthorityToOperate: [],
          cedarThreat: [],
          cedarSystemDetails: {
            cedarSystem: {
              id: '000-100-0',
              name: 'Application Programming Interface Gateway',
              description: '',
              acronym: '',
              status: '',
              businessOwnerOrg: '',
              businessOwnerOrgComp: '',
              systemMaintainerOrg: '',
              systemMaintainerOrgComp: ''
            }
          }
        }
      }
    };
    const { getByText, findByTestId } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/home']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={[query]} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const loading = await findByTestId('page-loading');
    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    });

    const readMore = getByText(/read more/i);
    await waitFor(() => {
      expect(readMore).toBeInTheDocument();
    });

    fireEvent.click(readMore);

    await waitFor(() => {
      expect(getByText(/read less/i)).toBeInTheDocument();
    });
  });
});
