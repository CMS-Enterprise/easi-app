import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import SubSystems from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('SubSystems', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit/sub-systems']}>
        <Route path="/systems/:systemId/edit/sub-systems">
          <MessageProvider>
            <SubSystems />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Sub-systems' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>('systemProfile:sectionCards.SUB_SYSTEMS.description')
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Next section: Team')).toBeInTheDocument();
  });
});
