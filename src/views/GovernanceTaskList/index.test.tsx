import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import GovernanceTaskList from '.';

describe('Governance Task List', () => {
  it('renders a request task list', async () => {
    const { getByRole } = render(
      <MemoryRouter>
        <MockedProvider>
          <GovernanceTaskList />
        </MockedProvider>
      </MemoryRouter>
    );

    // Header
    getByRole('heading', {
      level: 1,
      name: i18next.t<string>('itGov:taskList.heading')
    });

    // Crumb back to it gov home
    expect(
      getByRole('link', {
        name: i18next.t<string>('itGov:itGovernance')
      })
    ).toHaveAttribute('href', '/system/making-a-request');

    // Sidebar back to home
    expect(
      getByRole('link', {
        name: i18next.t<string>('itGov:button.saveAndExit')
      })
    ).toHaveAttribute('href', '/system/making-a-request');
  });
});
