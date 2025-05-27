import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetSystemIntakeGRBDiscussionsDocument,
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables,
  GRBVotingInformationStatus,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';
import { businessCase } from 'tests/mock/businessCase';
import {
  mockDiscussions,
  mockDiscussionsWithoutReplies
} from 'tests/mock/discussions';
import { getSystemIntakeGRBReviewQuery, grbReview } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';
import users from 'tests/mock/users';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ITGovAdminContext from '../../../../wrappers/ITGovAdminContext/ITGovAdminContext';

import { ModalProvider } from './RestartReviewModal/RestartReviewModalContext';
import GRBReview from '.';

const getSystemIntakeGRBReviewDiscussionsQuery: MockedQuery<
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables
> = {
  request: {
    query: GetSystemIntakeGRBDiscussionsDocument,
    variables: { id: systemIntake.id }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        __typename: 'SystemIntake',
        id: systemIntake.id,
        grbDiscussionsInternal: mockDiscussions(),
        grbDiscussionsPrimary: mockDiscussionsWithoutReplies()
      }
    }
  }
};

const currentGRBReviewer: SystemIntakeGRBReviewerFragment = {
  __typename: 'SystemIntakeGRBReviewer',
  id: 'b62addad-d490-42ab-a170-9b178a2f24eb',
  grbRole: SystemIntakeGRBReviewerRole.CMCS_REP,
  votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
  vote: null,
  voteComment: null,
  dateVoted: null,
  userAccount: {
    __typename: 'UserAccount',
    id: '38e6e472-5de2-49b4-aad2-cf1fd61ca87e',
    username: users[1].euaUserId,
    commonName: users[1].commonName,
    email: users[1].email
  }
};

describe('GRB review tab', () => {
  const store = easiMockStore();

  it('renders GRB reviewer view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeGRBReviewDiscussionsQuery,
            getSystemIntakeGRBReviewQuery()
          ]}
        >
          <Provider store={store}>
            <MessageProvider>
              <ModalProvider>
                <ITGovAdminContext.Provider value={false}>
                  <GRBReview
                    systemIntake={systemIntake}
                    businessCase={businessCase}
                  />
                </ITGovAdminContext.Provider>
              </ModalProvider>
            </MessageProvider>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    // Hide start review button
    expect(
      screen.queryByRole('button', { name: 'Set up GRB review' })
    ).toBeNull();
  });

  it('renders admin view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeGRBReviewDiscussionsQuery,
            getSystemIntakeGRBReviewQuery()
          ]}
        >
          <Provider store={store}>
            <MessageProvider>
              <ModalProvider>
                <ITGovAdminContext.Provider value>
                  <GRBReview
                    systemIntake={systemIntake}
                    businessCase={businessCase}
                  />
                </ITGovAdminContext.Provider>
              </ModalProvider>
            </MessageProvider>
          </Provider>
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
    // const date = '2024-09-10T14:42:47.422022Z';

    // const grbReviewWithDate = {
    //   ...grbReview,
    //   grbReviewStartedAt: date
    // };

    render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeGRBReviewQuery()]}>
          <Provider store={store}>
            <MessageProvider>
              <ITGovAdminContext.Provider value>
                <GRBReview
                  systemIntake={systemIntake}
                  businessCase={businessCase}
                />
              </ITGovAdminContext.Provider>
            </MessageProvider>
          </Provider>
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
        <VerboseMockedProvider mocks={[getSystemIntakeGRBReviewQuery()]}>
          <Provider store={store}>
            <MessageProvider>
              <ITGovAdminContext.Provider value>
                <GRBReview
                  systemIntake={systemIntake}
                  businessCase={businessCase}
                />
              </ITGovAdminContext.Provider>
            </MessageProvider>
          </Provider>
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

  it('renders the discussion summary', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeGRBReviewDiscussionsQuery,
            getSystemIntakeGRBReviewDiscussionsQuery,
            getSystemIntakeGRBReviewQuery({
              grbReviewStartedAt: '2024-10-21T14:55:47.88283Z'
            })
          ]}
        >
          <Provider store={store}>
            <MessageProvider>
              <ModalProvider>
                <ITGovAdminContext.Provider value>
                  <GRBReview
                    systemIntake={systemIntake}
                    businessCase={businessCase}
                  />
                </ITGovAdminContext.Provider>
              </ModalProvider>
            </MessageProvider>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Discussions summary', { exact: false })
    ).toBeInTheDocument();

    expect(
      await screen.findByText('5 total discussions (4 without replies)', {
        exact: false
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Jump to discussions' }));
  });

  describe('GRB voting panel', () => {
    it('renders for current GRB reviewers', async () => {
      const grbVotingInformation: SystemIntakeFragmentFragment['grbVotingInformation'] =
        {
          ...grbReview.grbVotingInformation,
          grbReviewers: [currentGRBReviewer],
          votingStatus: GRBVotingInformationStatus.IN_PROGRESS
        };

      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery({
                ...grbReview,
                grbVotingInformation
              })
            ]}
          >
            <Provider store={store}>
              <MessageProvider>
                <ModalProvider>
                  <ITGovAdminContext.Provider value={false}>
                    <GRBReview
                      systemIntake={{ ...systemIntake, grbVotingInformation }}
                      businessCase={businessCase}
                    />
                  </ITGovAdminContext.Provider>
                </ModalProvider>
              </MessageProvider>
            </Provider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByRole('heading', {
          name: 'Review this IT Governance request and share your opinion on its merit'
        })
      ).toBeInTheDocument();
    });

    it('is hidden if voting has not yet started', async () => {
      const grbVotingInformation: SystemIntakeFragmentFragment['grbVotingInformation'] =
        {
          ...grbReview.grbVotingInformation,
          grbReviewers: [currentGRBReviewer],
          votingStatus: GRBVotingInformationStatus.NOT_STARTED
        };

      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery({
                ...grbReview,
                grbVotingInformation
              })
            ]}
          >
            <Provider store={store}>
              <MessageProvider>
                <ModalProvider>
                  <ITGovAdminContext.Provider value={false}>
                    <GRBReview
                      systemIntake={{ ...systemIntake, grbVotingInformation }}
                      businessCase={businessCase}
                    />
                  </ITGovAdminContext.Provider>
                </ModalProvider>
              </MessageProvider>
            </Provider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole('heading', { name: 'GRB review' }));

      expect(
        screen.queryByRole('heading', {
          name: 'Review this IT Governance request and share your opinion on its merit'
        })
      ).not.toBeInTheDocument();
    });

    it('is hidden for non-GRB reviewers', async () => {
      const grbVotingInformation: SystemIntakeFragmentFragment['grbVotingInformation'] =
        {
          ...grbReview.grbVotingInformation,
          grbReviewers: [],
          votingStatus: GRBVotingInformationStatus.IN_PROGRESS
        };

      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery({
                ...grbReview,
                grbVotingInformation
              })
            ]}
          >
            <Provider store={store}>
              <MessageProvider>
                <ModalProvider>
                  <ITGovAdminContext.Provider value>
                    <GRBReview
                      systemIntake={{ ...systemIntake, grbVotingInformation }}
                      businessCase={businessCase}
                    />
                  </ITGovAdminContext.Provider>
                </ModalProvider>
              </MessageProvider>
            </Provider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole('heading', { name: 'GRB review' }));

      expect(
        screen.queryByRole('heading', {
          name: 'Review this IT Governance request and share your opinion on its merit'
        })
      ).not.toBeInTheDocument();
    });
  });
});
