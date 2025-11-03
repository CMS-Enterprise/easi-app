import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import {
  getSystemIntakeContactsQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import MockMessage from 'utils/testing/MockMessage';

import RequestHome from './index';

function renderWithProvider(mocks: MockedQuery[]) {
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <MessageProvider>
          <MockMessage />
          <RequestHome systemIntake={systemIntake} />
        </MessageProvider>
      </MemoryRouter>
    </MockedProvider>
  );
}

describe('RequestHome', () => {
  it('renders headings and summary sections', async () => {
    renderWithProvider([getSystemIntakeContactsQuery()]);

    // Main title and description
    expect(
      await screen.findByRole('heading', {
        name: i18next.t<string>('requestHome:requestHome.title')
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18next.t<string>('requestHome:requestHome.description'))
    ).toBeInTheDocument();

    // Section headings
    expect(
      screen.getByRole('heading', {
        name: 'Project team and points of contact'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Request summary' })
    ).toBeInTheDocument();
  });

  it('renders contacts fetched for the system intake', async () => {
    renderWithProvider([getSystemIntakeContactsQuery()]);

    const rows = await screen.findAllByRole('row', { name: /contact-/i });
    expect(rows.length).toBe(3);
  });

  it('toggles the overview content with show more/less', async () => {
    const user = userEvent.setup();
    renderWithProvider([getSystemIntakeContactsQuery()]);

    const showMore = screen.getByRole('button', {
      name: i18next.t<string>(
        'requestHome:requestHome.sections.requestSummary.overview.showMore'
      )
    });
    await user.click(showMore);

    // After expanding, the button label switches to show less
    expect(
      screen.getByRole('button', {
        name: i18next.t<string>(
          'requestHome:requestHome.sections.requestSummary.overview.showLess'
        )
      })
    ).toBeInTheDocument();
  });
});
