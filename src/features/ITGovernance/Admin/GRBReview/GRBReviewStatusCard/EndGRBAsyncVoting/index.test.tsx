import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GRBVotingInformationStatus,
  SystemIntakeGRBReviewFragment
} from 'gql/generated/graphql';
import { grbReviewers } from 'tests/mock/grbReview';

import { MessageProvider } from 'hooks/useMessage';
import { formatDaysHoursMinutes } from 'utils/date';

import EndGRBAsyncVoting from '.';

const grbVotingInformation: SystemIntakeGRBReviewFragment['grbVotingInformation'] =
  {
    __typename: 'GRBVotingInformation',
    votingStatus: GRBVotingInformationStatus.IN_PROGRESS,
    numberOfNoObjection: 4,
    numberOfObjection: 1,
    numberOfNotVoted: 0,
    grbReviewers
  };

const grbReviewAsyncEndDate = '2050-10-01T00:00:00Z';

describe('End GRB async voting modal', () => {
  it('calculates the time remaining', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <EndGRBAsyncVoting
              grbReviewAsyncEndDate={grbReviewAsyncEndDate}
              grbVotingInformation={grbVotingInformation}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    const { days, hours, minutes } = formatDaysHoursMinutes(
      grbReviewAsyncEndDate
    );

    userEvent.click(screen.getByRole('button', { name: 'End voting' }));

    expect(
      await screen.findByRole('heading', { name: 'End voting early?' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(`${days} days, ${hours} hours, ${minutes} minutes`)
    ).toBeInTheDocument();
  });

  it('renders the vote counts', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <EndGRBAsyncVoting
              grbReviewAsyncEndDate={grbReviewAsyncEndDate}
              grbVotingInformation={grbVotingInformation}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    userEvent.click(screen.getByRole('button', { name: 'End voting' }));

    expect(
      await screen.findByRole('heading', { name: 'End voting early?' })
    ).toBeInTheDocument();

    const { numberOfNoObjection, numberOfObjection, numberOfNotVoted } =
      grbVotingInformation;

    expect(
      screen.getByText(
        `${numberOfNoObjection} no objection, ${numberOfObjection} objection, ${numberOfNotVoted} not voted`
      )
    ).toBeInTheDocument();
  });
});
