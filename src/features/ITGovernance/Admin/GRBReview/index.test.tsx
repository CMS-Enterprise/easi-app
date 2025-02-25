import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';
import { businessCase } from 'tests/mock/businessCase';
import { systemIntake } from 'tests/mock/systemIntake';
import users from 'tests/mock/users';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ITGovAdminContext from '../ITGovAdminContext';

import GRBReview from '.';

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

    // Hide start review button
    expect(
      screen.queryByRole('button', { name: 'Set up GRB review' })
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
      screen.getByRole('button', { name: 'Set up GRB review' })
    ).toBeInTheDocument();
  });

  // TODO: Update unit test once feature is further developed
  test.skip('renders GRB review start date', () => {
    const date = '2024-09-10T14:42:47.422022Z';
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[]}
                grbReviewStartedAt={date}
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

  // TODO: Update unit test once feature is further developed
  test.skip('renders Set up GRB review modal', async () => {
    const grbReviewers: SystemIntakeGRBReviewerFragment[] = [
      {
        __typename: 'SystemIntakeGRBReviewer',
        id: 'b62addad-d490-42ab-a170-9b178a2f24eb',
        grbRole: SystemIntakeGRBReviewerRole.CMCS_REP,
        votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
        userAccount: {
          __typename: 'UserAccount',
          id: '38e6e472-5de2-49b4-aad2-cf1fd61ca87e',
          username: users[0].euaUserId,
          commonName: users[0].commonName,
          email: users[0].email
        }
      },
      {
        __typename: 'SystemIntakeGRBReviewer',
        id: 'b62addad-d490-42ab-a170-9b178a2f24eb',
        grbRole: SystemIntakeGRBReviewerRole.PROGRAM_INTEGRITY_BDG_CHAIR,
        votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
        userAccount: {
          __typename: 'UserAccount',
          id: '38e6e472-5de2-49b4-aad2-cf1fd61ca87e',
          username: users[1].euaUserId,
          commonName: users[1].commonName,
          email: users[1].email
        }
      }
    ];

    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={grbReviewers}
                grbReviewStartedAt={null}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    const startGrbReviewButton = screen.getByRole('button', {
      name: 'Set up GRB review'
    });

    userEvent.click(startGrbReviewButton);

    // Check that modal text displays correct number of reviewers
    const modalText = await screen.findByText(
      `Starting this review will send email notifications to ${grbReviewers.length} GRB reviewers.`,
      { exact: false }
    );

    expect(modalText).toBeInTheDocument();
  });
});
