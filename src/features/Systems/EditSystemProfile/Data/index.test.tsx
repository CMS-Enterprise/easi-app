import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import Data from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('Data', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit/data']}>
        <Route path="/systems/:systemId/edit/data">
          <MessageProvider>
            <Data />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Data' })).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>('systemProfile:sectionCards.DATA.description')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Next section: Tools and software')
    ).toBeInTheDocument();
  });
});
