import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/gen/graphql';

import { systemIntake } from 'data/mock/systemIntake';
import users from 'data/mock/users';
import { SystemIntakeState } from 'types/graphql-global-types';

import ITGovAdminContext from '../ITGovAdminContext';

import ParticipantsTable from './ParticipantsTable';

const user = users[0];

const grbReviewer: SystemIntakeGRBReviewerFragment = {
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

describe('GRB review participants table', () => {
  it('renders the table', () => {
    render(
      <MemoryRouter>
        <ITGovAdminContext.Provider value>
          <ParticipantsTable
            id={systemIntake.id}
            state={SystemIntakeState.OPEN}
            grbReviewers={[grbReviewer]}
            setReviewerToRemove={() => null}
          />
        </ITGovAdminContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(user.commonName)).toBeInTheDocument();
    expect(screen.getByText('Voting')).toBeInTheDocument();
    expect(screen.getByText('CMCS Rep')).toBeInTheDocument();

    // Renders action buttons for admins
    expect(screen.getByTestId('grbReviewerActions')).toBeInTheDocument();
  });

  it('renders closed request state for admins', () => {
    render(
      <MemoryRouter>
        <ITGovAdminContext.Provider value>
          <ParticipantsTable
            id={systemIntake.id}
            state={SystemIntakeState.CLOSED}
            grbReviewers={[]}
            setReviewerToRemove={() => null}
          />
        </ITGovAdminContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 're-open' })).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Add a GRB reviewer' })
    ).toBeDisabled();
  });

  it('hides action buttons for GRB reviewers', () => {
    render(
      <MemoryRouter>
        <ITGovAdminContext.Provider value={false}>
          <ParticipantsTable
            id={systemIntake.id}
            state={SystemIntakeState.OPEN}
            grbReviewers={[grbReviewer]}
            setReviewerToRemove={() => null}
          />
        </ITGovAdminContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('grbReviewerActions')).toBeNull();
  });
});
