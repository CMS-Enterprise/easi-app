import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';

import GetTrbRequestsQuery from 'queries/GetTrbRequestsQuery';

import StartRequest from './StartRequest';
import Steps from './Steps';
import TechnicalAssistance from '.';

describe('Technical Assistance (TRB) homepage', () => {
  it('renders the homepage with a list of trb requests', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter initialEntries={['/trb']}>
        <Route path="/trb">
          <MockedProvider
            mocks={[
              {
                request: {
                  query: GetTrbRequestsQuery
                },
                result: {
                  data: {
                    trbRequestCollection: [
                      {
                        id: '1afc9242-f244-47a3-9f91-4d6fedd8eb91',
                        name: 'My excellent question',
                        status: 'OPEN',
                        createdAt: '2022-09-12T17:46:08.067675Z'
                      },
                      {
                        id: '9841c768-bdcd-4856-bae2-62cfdaffacf6',
                        name: 'TACO Review',
                        status: 'OPEN',
                        createdAt: '2022-09-12T17:46:08.07031Z'
                      }
                    ]
                  }
                }
              }
            ]}
          >
            <TechnicalAssistance />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('TRB Subview snapshots', () => {
  it('matches NewRequest', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StartRequest />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('matches Steps', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[{ state: { requestType: 'NEED_HELP' } }]}>
        <Steps />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
