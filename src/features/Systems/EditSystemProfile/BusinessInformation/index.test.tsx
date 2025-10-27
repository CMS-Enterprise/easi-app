import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import BusinessInformation from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('BusinessInformation', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter
        initialEntries={['/systems/000-100-0/edit/business-information']}
      >
        <Route path="/systems/:systemId/edit/business-information">
          <MessageProvider>
            <BusinessInformation />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Business information' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.BUSINESS_INFORMATION.description'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Next section: Implementation details')
    ).toBeInTheDocument();
  });
});
