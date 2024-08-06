import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import {
  getSystemIntakeRelatedRequests,
  systemIntake
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RelatedRequestsTable from './RelatedRequestsTable';

describe('Related Requests table', () => {
  it('renders Related Requests table', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[getSystemIntakeRelatedRequests]}>
          <VerboseMockedProvider>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} />
            </MessageProvider>
          </VerboseMockedProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));
  });
});
