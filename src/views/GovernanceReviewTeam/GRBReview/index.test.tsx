import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { systemIntake } from 'data/mock/systemIntake';
import users from 'data/mock/users';
import { SystemIntakeGrbReviewer } from 'queries/types/SystemIntakeGrbReviewer';
import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'types/graphql-global-types';

import IsGrbViewContext from '../IsGrbViewContext';

import GRBReview from '.';

const user = users[0];

const grbReviewer: SystemIntakeGrbReviewer = {
  __typename: 'SystemIntakeGRBReviewer',
  id: 'b62addad-d490-42ab-a170-9b178a2f24eb',
  grbRole: SystemIntakeGRBReviewerRole.CMCS_REP,
  votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
  userAccount: {
    __typename: 'UserAccount',
    id: '38e6e472-5de2-49b4-aad2-cf1fd61ca87e',
    username: user.euaUserId,
    commonName: user.commonName,
    email: user.email
  }
};

describe('GRB review tab', () => {
  it('renders GRB reviewer view', async () => {
    render(
      <MemoryRouter>
        <IsGrbViewContext.Provider value>
          <GRBReview id={systemIntake.id} grbReviewers={[]} />
        </IsGrbViewContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('heading', { name: 'Available documentation' }));
  });

  it('renders GRT admin view', async () => {
    render(
      <MemoryRouter>
        <IsGrbViewContext.Provider value={false}>
          <GRBReview id={systemIntake.id} grbReviewers={[]} />
        </IsGrbViewContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('link', { name: 'Add a GRB reviewer' }));
  });

  describe('Participants table', () => {
    it('renders table for GRT admins', () => {
      render(
        <MemoryRouter>
          <IsGrbViewContext.Provider value={false}>
            <GRBReview id={systemIntake.id} grbReviewers={[grbReviewer]} />
          </IsGrbViewContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText(user.commonName)).toBeInTheDocument();
      expect(screen.getByText('Voting')).toBeInTheDocument();
      expect(screen.getByText('CMCS Rep')).toBeInTheDocument();

      expect(screen.getByTestId('grbReviewerActions')).toBeInTheDocument();
    });

    it('hides action buttons for GRB reviewers', () => {
      render(
        <MemoryRouter>
          <IsGrbViewContext.Provider value>
            <GRBReview id={systemIntake.id} grbReviewers={[grbReviewer]} />
          </IsGrbViewContext.Provider>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('grbReviewerActions')).toBeNull();
    });
  });
});
