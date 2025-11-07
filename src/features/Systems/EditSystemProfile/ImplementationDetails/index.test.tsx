import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import ImplementationDetails from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('ImplementationDetails', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter
        initialEntries={['/systems/000-100-0/edit/implementation-details']}
      >
        <Route path="/systems/:systemId/edit/implementation-details">
          <MessageProvider>
            <ImplementationDetails />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Implementation details' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.IMPLEMENTATION_DETAILS.description'
        )
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Next section: Data')).toBeInTheDocument();
  });
});
