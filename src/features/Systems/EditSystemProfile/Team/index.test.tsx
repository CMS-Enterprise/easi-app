import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import Team from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('Team', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit/team']}>
        <Route path="/systems/:systemId/edit/team">
          <MessageProvider>
            <Team />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>('systemProfile:sectionCards.TEAM.description')
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Next section: Contracts')).toBeInTheDocument();
  });
});
