import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import GetCedarSystemIdsQuery from 'queries/GetCedarSystemIdsQuery';

import RequestLinkForm from '.';

describe('IT Gov Request relation link form', () => {
  it('renders', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/system/link/fa93173c-2e8c-4371-b464-4b3dd649f940']}
      >
        <MockedProvider
          mocks={[
            {
              request: {
                query: GetCedarSystemIdsQuery
              },
              result: {
                data: {
                  cedarSystems: [
                    {
                      id: '{11AB1A00-1234-5678-ABC1-1A001B00CC0A}',
                      name: 'Centers for Management Services',
                      __typename: 'CedarSystem'
                    }
                  ]
                }
              }
            }
          ]}
          addTypename={false}
        >
          <Route path="/system/link/:systemId?">
            <RequestLinkForm />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
