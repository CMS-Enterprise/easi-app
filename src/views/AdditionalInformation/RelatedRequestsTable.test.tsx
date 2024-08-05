import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { systemIntake } from '../../data/mock/systemIntake';
import { MessageProvider } from '../../hooks/useMessage';
import VerboseMockedProvider from '../../utils/testing/VerboseMockedProvider';

import RelatedRequestsTable from './RelatedRequestsTable';

describe('Related Requests table', () => {
  it('renders Related Requests table', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <RelatedRequestsTable requestID={systemIntake.id} />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));
  });
});
