import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { systemIntake } from 'data/mock/systemIntake';
import GetSystemIntakeRelatedRequestsQuery from 'queries/GetSystemIntakeRelatedRequestsQuery';

import RelatedRequestsTable from './RelatedRequestsTable';

describe('Related Requests table', () => {
  it('renders Related Requests table', async () => {
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
        <MockedProvider mocks={mocks} addTypename={false}>
          <RelatedRequestsTable requestID={systemIntake.id} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));
  });
});
