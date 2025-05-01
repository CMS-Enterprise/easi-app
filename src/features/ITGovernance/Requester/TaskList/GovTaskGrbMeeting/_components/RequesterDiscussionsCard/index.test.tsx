import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ITGovGRBStatus } from 'gql/generated/graphql';
import {
  getSystemIntakeGRBDiscussionsQuery,
  mockDiscussions,
  mockDiscussionsWithoutReplies
} from 'tests/mock/discussions';
import { systemIntake } from 'tests/mock/systemIntake';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequesterDiscussionsCard from '.';

const discussions = mockDiscussions();
const discussionsWithoutReplies = mockDiscussionsWithoutReplies();

describe('Requester discussions card', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeGRBDiscussionsQuery()]}>
          <RequesterDiscussionsCard
            systemIntakeId={systemIntake.id}
            grbMeetingStatus={ITGovGRBStatus.REVIEW_IN_PROGRESS}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('discussions-total')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders awaiting decision status with no discussions', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeGRBDiscussionsQuery({ grbDiscussionsPrimary: [] })
          ]}
        >
          <RequesterDiscussionsCard
            systemIntakeId={systemIntake.id}
            grbMeetingStatus={ITGovGRBStatus.AWAITING_DECISION}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText('There were no discussions during this review.')
    ).toBeInTheDocument();

    // Start a discussion button should be hidden when awaiting decision
    expect(
      screen.queryByRole('button', { name: 'Start a discussion' })
    ).toBeNull();
  });

  it('renders in progress with no discussions', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeGRBDiscussionsQuery({ grbDiscussionsPrimary: [] })
          ]}
        >
          <RequesterDiscussionsCard
            systemIntakeId={systemIntake.id}
            grbMeetingStatus={ITGovGRBStatus.REVIEW_IN_PROGRESS}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        'There are not yet any discussions for this review.'
      )
    ).toBeInTheDocument();
  });

  it('renders the correct number of discussions', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeGRBDiscussionsQuery()]}>
          <RequesterDiscussionsCard
            systemIntakeId={systemIntake.id}
            grbMeetingStatus={ITGovGRBStatus.REVIEW_IN_PROGRESS}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    // Check discussion counts
    expect(
      await screen.findByTestId('discussions-without-replies')
    ).toHaveTextContent(`${discussionsWithoutReplies.length}`);

    expect(await screen.findByTestId('discussions-total')).toHaveTextContent(
      `${discussions.length + discussionsWithoutReplies.length}`
    );
  });
});
