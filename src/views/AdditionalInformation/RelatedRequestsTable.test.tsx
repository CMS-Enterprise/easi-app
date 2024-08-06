import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { systemIntake } from 'data/mock/systemIntake';
import GetSystemIntakeRelatedRequestsQuery from 'queries/GetSystemIntakeRelatedRequestsQuery';
import {
  SystemIntakeDecisionState,
  TRBRequestStatus
} from 'types/graphql-global-types';
import easiMockStore from 'utils/testing/easiMockStore';

import { MessageProvider } from '../../hooks/useMessage';

import RelatedRequestsTable from './RelatedRequestsTable';

describe('Related Requests table', () => {
  const mockStore = easiMockStore();

  it('renders empty Related Requests table', async () => {
    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [],
              relatedTRBRequests: []
            }
          }
        }
      }
    ];
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable systemIntakeID={systemIntake.id} />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));
    expect(
      await screen.findByText(
        'There are no additional requests linked to this system'
      )
    );
  });

  it('renders Related Requests table with data', async () => {
    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable systemIntakeID={systemIntake.id} />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));

    // this should NOT be in rendered if there is incoming table data
    expect(() =>
      screen.getByText('There are no additional requests linked to this system')
    ).toThrow();
  });
});
