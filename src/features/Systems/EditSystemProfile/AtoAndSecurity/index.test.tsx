import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import AtoAndSecurity from '.';

describe('AtoAndSecurity', () => {
  it('renders section name and description', () => {
    render(
      <MemoryRouter
        initialEntries={['/systems/000-100-0/edit/ato-and-security']}
      >
        <Route path="/systems/:systemId/edit/ato-and-security">
          <MessageProvider>
            <AtoAndSecurity />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'ATO and security' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.ATO_AND_SECURITY.description'
        )
      )
    ).toBeInTheDocument();
  });
});
