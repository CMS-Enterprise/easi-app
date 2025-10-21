import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import Contracts from '.';

describe('Contracts', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit/contracts']}>
        <Route path="/systems/:systemId/edit/contracts">
          <MessageProvider>
            <Contracts />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Contracts' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>('systemProfile:sectionCards.CONTRACTS.description')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Next section: Funding and budget')
    ).toBeInTheDocument();
  });
});
