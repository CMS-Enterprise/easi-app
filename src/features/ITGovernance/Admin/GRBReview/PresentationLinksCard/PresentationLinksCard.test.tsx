import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeDocumentStatus,
  SystemIntakeGRBPresentationLinksFragmentFragment
} from 'gql/generated/graphql';
import { systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { getExpectedAlertType } from 'utils/testing/helpers';

import ITGovAdminContext from '../../../../../wrappers/ITGovAdminContext/ITGovAdminContext';

import PresentationLinksCard from './PresentationLinksCard';

describe('Async Presentation Links Card', () => {
  const grbPresentationLinksMock = systemIntake.grbPresentationLinks!;
  const formattedRecordingPasscode = `(Passcode: ${grbPresentationLinksMock?.recordingPasscode})`;

  function renderCard(
    grbPresentationLinks: SystemIntakeGRBPresentationLinksFragmentFragment | null,
    isAdmin: boolean = true
  ) {
    return render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/grb-review`]}
      >
        <MessageProvider>
          <MockedProvider>
            <ITGovAdminContext.Provider value={isAdmin}>
              <PresentationLinksCard
                systemIntakeID={systemIntake.id}
                grbPresentationLinks={grbPresentationLinks}
              />
            </ITGovAdminContext.Provider>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  }

  it('renders the presentation links with transcript file', () => {
    renderCard(grbPresentationLinksMock);

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'Add asynchronous presentation links'
      })
    ).not.toBeInTheDocument();

    screen.getByRole('link', { name: 'Edit presentation links' });
    screen.getByRole('button', { name: 'Remove all presentation links' });

    screen.getByRole('button', { name: 'View recording' });
    screen.getByText(formattedRecordingPasscode);
    screen.getByRole('button', { name: 'View transcript' });
    screen.getByRole('button', { name: 'View slide deck' });
  });

  it('renders the transcript link', () => {
    renderCard({
      ...grbPresentationLinksMock,
      transcriptFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE,
      transcriptLink: 'http://transcriptlink.com'
    });

    screen.getByRole('button', { name: 'View transcript' });
  });

  it('renders virus scanning text', () => {
    renderCard({
      ...grbPresentationLinksMock,
      presentationDeckFileStatus: SystemIntakeDocumentStatus.PENDING
    });

    screen.queryByText('Virus scanning in progress...');
  });

  it('hides empty fields', () => {
    renderCard({
      ...grbPresentationLinksMock,
      recordingPasscode: '',
      transcriptLink: '',
      transcriptFileStatus: null,
      presentationDeckFileStatus: null
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'Add asynchronous presentation links'
      })
    ).not.toBeInTheDocument();

    screen.getByRole('button', { name: 'View recording' });

    expect(
      screen.queryByText(formattedRecordingPasscode)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: 'View transcript' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'View slide deck' })
    ).not.toBeInTheDocument();
  });

  it('hides empty card for GRB reviewers', () => {
    renderCard(null, false);

    expect(
      screen.queryByRole('header', { name: 'Asynchronous presentation' })
    ).not.toBeInTheDocument();
  });

  it('renders admin empty state', () => {
    renderCard(null);

    expect(getExpectedAlertType('info')).toHaveTextContent(
      'If this GRB review has an asynchronous presentation and recording, you may add that content to EASi to provide additional information for GRB reviews.'
    );

    screen.getByRole('link', { name: 'Add asynchronous presentation links' });
  });

  it('hides action links for GRB reviewers', () => {
    renderCard(grbPresentationLinksMock, false);

    expect(
      screen.queryByRole('link', { name: 'Edit presentation links' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Remove all presentation links' })
    ).not.toBeInTheDocument();
  });
});
