import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/gen/graphql';

import { businessCase } from 'data/mock/businessCase';
import { systemIntake } from 'data/mock/systemIntake';
import users from 'data/mock/users';
import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ITGovAdminContext from '../ITGovAdminContext';

import GRBReview from '.';

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

describe('GRB review tab', () => {
  it('renders GRB reviewer view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value={false}>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[]}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('heading', { name: 'Available documentation' }));

    // Hide start review button
    expect(
      screen.queryByRole('button', { name: 'Start GRB review' })
    ).toBeNull();
  });

  it('renders GRT admin view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[]}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    // Start review button
    expect(
      screen.getByRole('button', { name: 'Start GRB review' })
    ).toBeInTheDocument();

    // Add reviewer button
    expect(screen.getByRole('button', { name: 'Add a GRB reviewer' }));
  });

  it('renders GRB review start date', () => {
    const date = '2024-09-10T14:42:47.422022Z';
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[grbReviewer]}
                // TODO: Update prop after backend work is done
                grbReviewStartDate={date}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText('Review started on 09/10/2024')
    ).toBeInTheDocument();
  });

  describe('Participants table', () => {
    it('renders table for GRT admins', () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider>
            <MessageProvider>
              <ITGovAdminContext.Provider value>
                <GRBReview
                  {...systemIntake}
                  businessCase={businessCase}
                  grbReviewers={[grbReviewer]}
                />
              </ITGovAdminContext.Provider>
            </MessageProvider>
          </VerboseMockedProvider>
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
          <VerboseMockedProvider>
            <MessageProvider>
              <ITGovAdminContext.Provider value={false}>
                <GRBReview
                  {...systemIntake}
                  businessCase={businessCase}
                  grbReviewers={[grbReviewer]}
                />
              </ITGovAdminContext.Provider>
            </MessageProvider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      // Hides action buttons in Participants table
      expect(screen.queryByTestId('grbReviewerActions')).toBeNull();
    });
  });
});
