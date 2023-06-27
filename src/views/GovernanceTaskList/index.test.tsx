import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import GovernanceTaskList from '.';

describe('Governance Task List', () => {
  it('renders a request task list', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <MockedProvider>
          <GovernanceTaskList />
        </MockedProvider>
      </MemoryRouter>
    );

    getByText(i18next.t<string>('itGov:taskList.heading'));
  });
});
