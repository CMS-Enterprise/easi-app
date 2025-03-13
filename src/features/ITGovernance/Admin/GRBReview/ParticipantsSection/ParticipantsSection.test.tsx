import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeState
} from 'gql/generated/graphql';
import { systemIntake } from 'tests/mock/systemIntake';
import users from 'tests/mock/users';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import { MessageProvider } from 'hooks/useMessage';

import ParticipantsSection from './ParticipantsSection';

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
  it('renders admin view', () => {
    render(
      <MemoryRouter>
        <MessageProvider>
          <ITGovAdminContext.Provider value>
            <ParticipantsSection
              id={systemIntake.id}
              state={SystemIntakeState.OPEN}
              grbReviewers={[grbReviewer]}
              grbReviewStartedAt={null}
            />
          </ITGovAdminContext.Provider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Add another GRB reviewer' }));

    // Check for Start GRB Review alert
    expect(
      screen.getByRole('link', { name: 'Start GRB Review' })
    ).toBeInTheDocument();

    // Table renders GRB reviewer
    expect(screen.getByText(user.commonName)).toBeInTheDocument();
    expect(screen.getByText('Voting')).toBeInTheDocument();
    expect(screen.getByText('CMCS Rep')).toBeInTheDocument();

    // Renders action buttons for admins
    expect(screen.getByTestId('grbReviewerActions')).toBeInTheDocument();
  });

  it('hides alert after review is started', () => {
    render(
      <MemoryRouter>
        <MessageProvider>
          <ITGovAdminContext.Provider value>
            <ParticipantsSection
              id={systemIntake.id}
              state={SystemIntakeState.OPEN}
              grbReviewers={[grbReviewer]}
              grbReviewStartedAt="2024-09-10T14:42:47.422022Z"
            />
          </ITGovAdminContext.Provider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: 'Start GRB Review' })).toBeNull();
  });

  it('renders closed request state for admins', () => {
    render(
      <MemoryRouter>
        <MessageProvider>
          <ITGovAdminContext.Provider value>
            <ParticipantsSection
              id={systemIntake.id}
              state={SystemIntakeState.CLOSED}
              grbReviewers={[]}
              grbReviewStartedAt={null}
            />
          </ITGovAdminContext.Provider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 're-open' })).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Add a GRB reviewer' })
    ).toBeDisabled();

    expect(screen.queryByRole('link', { name: 'Start GRB Review' })).toBeNull();
  });

  it('renders GRB reviewer view', () => {
    render(
      <MemoryRouter>
        <MessageProvider>
          <ITGovAdminContext.Provider value={false}>
            <ParticipantsSection
              id={systemIntake.id}
              state={SystemIntakeState.OPEN}
              grbReviewers={[grbReviewer]}
              grbReviewStartedAt={null}
            />
          </ITGovAdminContext.Provider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Available documentation' }));

    expect(
      screen.queryByRole('link', { name: 'Add a GRB reviewer' })
    ).toBeNull();

    expect(screen.queryByRole('link', { name: 'Start GRB Review' })).toBeNull();

    expect(screen.queryByTestId('grbReviewerActions')).toBeNull();
  });
});
