import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetSystemIntakeGRBDiscussionsDocument,
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables,
  GRBVotingInformationStatus,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeState,
  SystemIntakeStatusAdmin
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

  describe('Presentation links card', () => {
    it('hides empty card for GRB reviewers', () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery({
                grbPresentationLinks: null,
                grbReviewStandardStatus:
                  SystemIntakeGRBReviewStandardStatusType.COMPLETED
              })
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

      expect(
        screen.queryByTestId('presentation-links-card')
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('header', { name: 'Presentation links' })
      ).not.toBeInTheDocument();
    });

    it('hides the presentation links card for completed standard meeting type', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery({
                ...grbReview,
                grbReviewStandardStatus:
                  SystemIntakeGRBReviewStandardStatusType.COMPLETED
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
        screen.queryByTestId('presentation-links-card')
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('heading', { name: 'Presentation links' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Admin task card', () => {
    it('renders the card', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery(grbReview)
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
        await screen.findByRole('heading', { level: 1, name: 'GRB review' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', { name: 'Admin Task' })
      ).toBeInTheDocument();
    });

    it('hides the card if the request is closed', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery(grbReview)
            ]}
          >
            <Provider store={store}>
              <MessageProvider>
                <ModalProvider>
                  <ITGovAdminContext.Provider value>
                    <GRBReview
                      systemIntake={{
                        ...systemIntake,
                        state: SystemIntakeState.CLOSED
                      }}
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
        await screen.findByRole('heading', { level: 1, name: 'GRB review' })
      ).toBeInTheDocument();

      expect(screen.queryByRole('heading', { name: 'Admin Task' })).toBeNull();
    });

    it('hides the card if the request is awaiting a decision', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery(grbReview)
            ]}
          >
            <Provider store={store}>
              <MessageProvider>
                <ModalProvider>
                  <ITGovAdminContext.Provider value>
                    <GRBReview
                      systemIntake={{
                        ...systemIntake,
                        statusAdmin:
                          SystemIntakeStatusAdmin.GRB_MEETING_COMPLETE
                      }}
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
        await screen.findByRole('heading', { level: 1, name: 'GRB review' })
      ).toBeInTheDocument();

      expect(screen.queryByRole('heading', { name: 'Admin Task' })).toBeNull();
    });

    it('hides the card if the setup form has been submitted for a standard meeting', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBReviewDiscussionsQuery,
              getSystemIntakeGRBReviewQuery({
                ...grbReview,
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
        await screen.findByRole('heading', { level: 1, name: 'GRB review' })
      ).toBeInTheDocument();

      expect(screen.queryByRole('heading', { name: 'Admin Task' })).toBeNull();
    });
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
