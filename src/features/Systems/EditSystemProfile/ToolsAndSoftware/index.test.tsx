import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import ToolsAndSoftware from '.';

describe('ToolsAndSoftware', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter
        initialEntries={['/systems/000-100-0/edit/tools-and-software']}
      >
        <Route path="/systems/:systemId/edit/tools-and-software">
          <MessageProvider>
            <ToolsAndSoftware />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Tools and software' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.TOOLS_AND_SOFTWARE.description'
        )
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Next section: Sub-systems')).toBeInTheDocument();
  });
});
