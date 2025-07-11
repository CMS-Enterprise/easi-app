import React, { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeDocumentStatus,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import { grbPresentationLinks, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { getExpectedAlertType } from 'utils/testing/helpers';

import ITGovAdminContext from '../../../../../wrappers/ITGovAdminContext/ITGovAdminContext';
import { ModalProvider } from '../RestartReviewModal/RestartReviewModalContext';

import PresentationLinksCard from './PresentationLinksCard';

describe('Async Presentation Links Card', () => {
  const formattedRecordingPasscode = `(Passcode: ${grbPresentationLinks?.recordingPasscode})`;

  function renderCard(
    props: Partial<ComponentProps<typeof PresentationLinksCard>>,
    isAdmin: boolean = true
  ) {
    const {
      grbReviewStartedAt = '2025-04-04T19:56:57.994482Z',
      grbReviewType = SystemIntakeGRBReviewType.ASYNC
    } = props;

    return render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/grb-review`]}
      >
        <MessageProvider>
          <MockedProvider>
            <ModalProvider>
              <ITGovAdminContext.Provider value={isAdmin}>
                <PresentationLinksCard
                  systemIntakeID={systemIntake.id}
                  grbReviewType={grbReviewType}
                  grbPresentationLinks={props.grbPresentationLinks}
                  grbReviewAsyncStatus={props.grbReviewAsyncStatus}
                  grbReviewStartedAt={grbReviewStartedAt}
                  grbReviewStandardStatus={props.grbReviewStandardStatus}
                  grbReviewAsyncRecordingTime={
                    props.grbReviewAsyncRecordingTime
                  }
                />
              </ITGovAdminContext.Provider>
            </ModalProvider>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  }

  it('renders the presentation links with transcript file', () => {
    renderCard({ grbPresentationLinks });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'Add asynchronous presentation links'
      })
    ).not.toBeInTheDocument();

    expect(screen.getByTestId('presentation-card-actions')).toBeInTheDocument();

    screen.getByRole('link', { name: 'Edit presentation links' });
    screen.getByRole('button', { name: 'Remove all presentation links' });

    screen.getByRole('button', { name: 'View recording' });
    screen.getByText(formattedRecordingPasscode);
    screen.getByRole('button', { name: 'View transcript' });
    screen.getByRole('button', { name: 'View slide deck' });
  });

  it('renders the transcript link', () => {
    renderCard({
      grbPresentationLinks: {
        ...grbPresentationLinks,
        transcriptFileStatus: null,
        transcriptFileURL: null,
        transcriptFileName: null,
        transcriptLink: 'http://transcriptlink.com'
      }
    });

    screen.getByRole('button', { name: 'View transcript' });
  });

  it('renders virus scanning text', () => {
    renderCard({
      grbPresentationLinks: {
        ...grbPresentationLinks,
        presentationDeckFileStatus: SystemIntakeDocumentStatus.PENDING
      }
    });

    expect(
      screen.getByText('Virus scanning in progress...')
    ).toBeInTheDocument();
  });

  it('hides empty fields', () => {
    renderCard({
      grbPresentationLinks: {
        ...grbPresentationLinks,
        recordingPasscode: '',
        transcriptLink: '',
        transcriptFileStatus: null,
        presentationDeckFileStatus: null
      }
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
    renderCard({ grbPresentationLinks: null }, false);

    expect(
      screen.queryByRole('header', { name: 'Asynchronous presentation' })
    ).not.toBeInTheDocument();
  });

  it('renders admin empty state', () => {
    renderCard({ grbPresentationLinks: null });

    expect(getExpectedAlertType('info')).toHaveTextContent(
      'If this GRB review has an asynchronous presentation and recording, you may add that content to EASi to provide additional information for GRB reviews.'
    );

    screen.getByRole('link', { name: 'Add asynchronous presentation links' });
  });

  it('hides action links for GRB reviewers', () => {
    renderCard({ grbPresentationLinks }, false);

    expect(
      screen.queryByRole('link', { name: 'Edit presentation links' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Remove all presentation links' })
    ).not.toBeInTheDocument();
  });

  it('renders the async presentation date', () => {
    renderCard({
      grbPresentationLinks,
      grbReviewAsyncRecordingTime: '2025-07-26T05:00:00Z'
    });

    screen.getByText('Asynchronous presentation: 07/26/2025');
  });

  it('renders async presentation not scheduled', () => {
    renderCard({
      grbPresentationLinks
    });

    screen.getByText('Asynchronous presentation not scheduled yet');
  });

  it('hides presentation date text for standard meetings', () => {
    renderCard({
      grbReviewType: SystemIntakeGRBReviewType.STANDARD
    });

    expect(
      screen.queryByText('Asynchronous presentation not scheduled yet')
    ).not.toBeInTheDocument();
  });

  it('hides action links for GRB reviewers', () => {
    renderCard({ grbPresentationLinks }, false);

    // Hides action buttons

    expect(
      screen.queryByTestId('presentation-card-actions')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: 'Edit presentation links' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Remove all presentation links' })
    ).not.toBeInTheDocument();
  });

  it('renders the complete state - async review', async () => {
    renderCard({
      grbPresentationLinks,
      grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType.COMPLETED
    });

    expect(await screen.findByText(/this review is over/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'restart' })).toBeInTheDocument();

    // Hides action buttons

    expect(
      screen.queryByTestId('presentation-card-actions')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: 'Edit presentation links' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Remove all presentation links' })
    ).not.toBeInTheDocument();
  });

  it('renders the complete state - standard meeting', async () => {
    renderCard({
      grbPresentationLinks,
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbReviewStandardStatus: SystemIntakeGRBReviewStandardStatusType.COMPLETED
    });

    // Restart review button does not render for standard meetings

    expect(screen.queryByText(/this review is over/i)).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'restart' })
    ).not.toBeInTheDocument();

    // Hides action buttons

    expect(
      screen.queryByTestId('presentation-card-actions')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: 'Edit presentation links' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Remove all presentation links' })
    ).not.toBeInTheDocument();
  });

  it('renders the review not started variant', () => {
    renderCard({ grbReviewStartedAt: null });

    expect(
      screen.getByText(
        'You have not completed setup for this review. Continue the GRB review setup process to add presentation links and/or a slide deck.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Continue GRB review setup' })
    ).toBeInTheDocument();
  });
});
