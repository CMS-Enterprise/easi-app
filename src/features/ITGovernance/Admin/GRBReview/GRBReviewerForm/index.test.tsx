import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CreateSystemIntakeGRBReviewersDocument,
  CreateSystemIntakeGRBReviewersMutation,
  CreateSystemIntakeGRBReviewersMutationVariables,
  GetCedarContactsDocument,
  GetCedarContactsQuery,
  GetCedarContactsQueryVariables,
  GetGRBReviewersComparisonsDocument,
  GetGRBReviewersComparisonsQuery,
  GetGRBReviewersComparisonsQueryVariables,
  GetSystemIntakeGRBReviewDocument,
  GetSystemIntakeGRBReviewQuery,
  GetSystemIntakeGRBReviewQueryVariables,
  GRBVotingInformationStatus,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewType,
  UpdateSystemIntakeGRBReviewerDocument,
  UpdateSystemIntakeGRBReviewerMutation,
  UpdateSystemIntakeGRBReviewerMutationVariables
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { grbReview } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import MockUsers from 'utils/testing/MockUsers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ParticipantsSection from '../ParticipantsSection/ParticipantsSection';

import AddReviewerFromEua from './AddReviewerFromEua';
import GRBReviewerForm from '.';

const mockUsers = new MockUsers();
const user = mockUsers.findByCommonName('Jerry Seinfeld')!;
const contact = user.userInfo;

const contactLabel = `${contact.commonName}, ${contact.euaUserId} (${contact.email})`;

const grbReviewer: SystemIntakeGRBReviewerFragment = {
  __typename: 'SystemIntakeGRBReviewer',
  id: '5b78f877-2848-40b2-a123-96872c40f744',
  userAccount: {
    __typename: 'UserAccount',
    id: '6867f3b6-283f-492b-a180-2066470e2a0a',
    commonName: contact.commonName,
    email: contact.email,
    username: contact.euaUserId
  },
  vote: null,
  voteComment: null,
  dateVoted: null,
  votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
  grbRole: SystemIntakeGRBReviewerRole.CMCS_REP
};

const updatedGRBReviewer: SystemIntakeGRBReviewerFragment = {
  ...grbReviewer,
  votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
  grbRole: SystemIntakeGRBReviewerRole.QIO_REP
};

// Cedar contacts query mock
const cedarContactsQuery = (
  commonName: string
): MockedQuery<GetCedarContactsQuery, GetCedarContactsQueryVariables> => ({
  request: {
    query: GetCedarContactsDocument,
    variables: {
      commonName
    }
  },
  result: {
    data: {
      __typename: 'Query',
      cedarPersonsByCommonName: [contact]
    }
  }
});

const createSystemIntakeGRBReviewersQuery: MockedQuery<
  CreateSystemIntakeGRBReviewersMutation,
  CreateSystemIntakeGRBReviewersMutationVariables
> = {
  request: {
    query: CreateSystemIntakeGRBReviewersDocument,
    variables: {
      input: {
        systemIntakeID: systemIntake.id,
        reviewers: [
          {
            euaUserId: contact.euaUserId,
            votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
            grbRole: SystemIntakeGRBReviewerRole.CMCS_REP
          }
        ]
      }
    }
  },
  result: {
    data: {
      __typename: 'Mutation',
      createSystemIntakeGRBReviewers: {
        __typename: 'CreateSystemIntakeGRBReviewersPayload',
        reviewers: [grbReviewer]
      }
    }
  }
};

const updateSystemIntakeGRBReviewerQuery: MockedQuery<
  UpdateSystemIntakeGRBReviewerMutation,
  UpdateSystemIntakeGRBReviewerMutationVariables
> = {
  request: {
    query: UpdateSystemIntakeGRBReviewerDocument,
    variables: {
      input: {
        reviewerID: grbReviewer.id,
        votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
        grbRole: SystemIntakeGRBReviewerRole.QIO_REP
      }
    }
  },
  result: {
    data: {
      __typename: 'Mutation',
      updateSystemIntakeGRBReviewer: updatedGRBReviewer
    }
  }
};

const grbVotingInformation: {
  __typename: 'GRBVotingInformation';
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  votingStatus: GRBVotingInformationStatus;
  numberOfNoObjection: number;
  numberOfObjection: number;
  numberOfNotVoted: number;
} = {
  __typename: 'GRBVotingInformation',
  grbReviewers: [],
  votingStatus: GRBVotingInformationStatus.NOT_STARTED,
  numberOfNoObjection: 0,
  numberOfObjection: 0,
  numberOfNotVoted: 0
};

const getSystemIntakeGRBReviewQuery = (
  reviewer?: SystemIntakeGRBReviewerFragment
): MockedQuery<
  GetSystemIntakeGRBReviewQuery,
  GetSystemIntakeGRBReviewQueryVariables
> => ({
  request: {
    query: GetSystemIntakeGRBReviewDocument,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        __typename: 'SystemIntake',
        id: systemIntake.id,
        grbDate: '2022-10-21T14:55:47.88283Z',
        grbReviewAsyncEndDate: '2022-10-21T14:55:47.88283Z',
        grbReviewAsyncRecordingTime: '2022-10-21T14:55:47.88283Z',
        grbPresentationLinks: null,
        grbVotingInformation: {
          __typename: 'GRBVotingInformation',
          grbReviewers: reviewer ? [reviewer] : [],
          votingStatus: GRBVotingInformationStatus.NOT_STARTED,
          numberOfNoObjection: 0,
          numberOfObjection: 0,
          numberOfNotVoted: 0
        },
        grbReviewStartedAt: null,
        grbReviewType: SystemIntakeGRBReviewType.STANDARD,
        documents: []
      }
    }
  }
});

export default getSystemIntakeGRBReviewQuery;

const getGRBReviewersComparisonsQuery: MockedQuery<
  GetGRBReviewersComparisonsQuery,
  GetGRBReviewersComparisonsQueryVariables
> = {
  request: {
    query: GetGRBReviewersComparisonsDocument,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      compareGRBReviewersByIntakeID: []
    }
  }
};

const populatedGRBVotingInformation = { ...grbVotingInformation };
populatedGRBVotingInformation.grbReviewers = [grbReviewer];

const updatedGRBVotingInformation = { ...grbVotingInformation };
updatedGRBVotingInformation.grbReviewers = [updatedGRBReviewer];

describe('GRB reviewer form', () => {
  const store = easiMockStore();
  it('adds a GRB reviewer', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/grb-review/add`]}
      >
        <VerboseMockedProvider
          mocks={[
            getGRBReviewersComparisonsQuery,
            cedarContactsQuery('Je'),
            cedarContactsQuery('Jerry Seinfeld'),
            createSystemIntakeGRBReviewersQuery,
            getSystemIntakeGRBReviewQuery(),
            getSystemIntakeGRBReviewQuery(grbReviewer)
          ]}
        >
          <Provider store={store}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/grb-review/:action">
                <ITGovAdminContext.Provider value>
                  <GRBReviewerForm
                    isFromGRBSetup={false}
                    initialGRBReviewers={
                      systemIntake.grbVotingInformation?.grbReviewers || []
                    }
                    grbReviewStartedAt={grbReview.grbReviewStartedAt}
                  />
                </ITGovAdminContext.Provider>
              </Route>
              <Route path="/it-governance/:systemId/grb-review">
                <ITGovAdminContext.Provider value>
                  <ParticipantsSection
                    id={systemIntake.id}
                    state={systemIntake.state}
                    grbReviewers={[
                      {
                        ...grbReviewer
                      }
                    ]}
                    grbReviewStartedAt={grbReview.grbReviewStartedAt}
                  />
                </ITGovAdminContext.Provider>
              </Route>
            </MessageProvider>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Add a GRB reviewer' }));

    const formContainer = within(
      screen.getByTestId('addReviewerFromEua-panel')
    );

    const contactInput = formContainer.getByRole('combobox', {
      name: 'GRB member name *'
    });

    userEvent.type(contactInput, 'Je');
    userEvent.click(await formContainer.findByText(contactLabel));
    expect(contactInput).toHaveValue(contactLabel);

    const votingRoleField = formContainer.getByRole('combobox', {
      name: 'Voting role *'
    });
    userEvent.selectOptions(votingRoleField, 'VOTING');
    expect(votingRoleField).toHaveValue('VOTING');

    const grbRoleField = formContainer.getByRole('combobox', {
      name: 'GRB role *'
    });
    userEvent.selectOptions(grbRoleField, 'CMCS_REP');
    expect(grbRoleField).toHaveValue('CMCS_REP');

    const submitButton = formContainer.getByRole('button', {
      name: 'Add reviewer'
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(submitButton).not.toBeDisabled();
    userEvent.click(submitButton);

    const reviewerRow = await screen.findByTestId(
      `grbReviewer-${contact.euaUserId}`
    );

    expect(within(reviewerRow).getByRole('cell', { name: contact.commonName }));
    expect(within(reviewerRow).getByRole('cell', { name: 'Voting' }));
    expect(within(reviewerRow).getByRole('cell', { name: 'CMCS Rep' }));
  });

  it('edits a GRB reviewer', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/it-governance/${systemIntake.id}/grb-review/edit`,
            state: grbReviewer
          }
        ]}
      >
        <VerboseMockedProvider
          mocks={[
            getGRBReviewersComparisonsQuery,
            cedarContactsQuery(contactLabel),
            updateSystemIntakeGRBReviewerQuery,
            getSystemIntakeGRBReviewQuery(),
            getSystemIntakeGRBReviewQuery(grbReviewer),
            getSystemIntakeGRBReviewQuery(updatedGRBReviewer)
          ]}
        >
          <Provider store={store}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/grb-review/:action">
                <ITGovAdminContext.Provider value>
                  <GRBReviewerForm
                    isFromGRBSetup={false}
                    initialGRBReviewers={
                      systemIntake.grbVotingInformation?.grbReviewers || []
                    }
                    grbReviewStartedAt={grbReview.grbReviewStartedAt}
                  />
                </ITGovAdminContext.Provider>
              </Route>
              <Route path="/it-governance/:systemId/grb-review">
                <ITGovAdminContext.Provider value>
                  <ParticipantsSection
                    id={systemIntake.id}
                    state={systemIntake.state}
                    grbReviewers={[
                      {
                        ...updatedGRBReviewer
                      }
                    ]}
                    grbReviewStartedAt={grbReview.grbReviewStartedAt}
                  />
                </ITGovAdminContext.Provider>
              </Route>
            </MessageProvider>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Add a GRB reviewer' }));

    const contactInput = screen.getByRole('combobox', {
      name: 'GRB member name *'
    });

    expect(contactInput).toBeDisabled();
    expect(contactInput).toHaveValue(contactLabel);

    const votingRoleField = screen.getByRole('combobox', {
      name: 'Voting role *'
    });
    userEvent.selectOptions(votingRoleField, 'NON_VOTING');
    expect(votingRoleField).toHaveValue('NON_VOTING');

    const grbRoleField = screen.getByRole('combobox', { name: 'GRB role *' });
    userEvent.selectOptions(grbRoleField, 'QIO_REP');
    expect(grbRoleField).toHaveValue('QIO_REP');

    const submitButton = screen.getByRole('button', { name: 'Save changes' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(submitButton).not.toBeDisabled();
    userEvent.click(submitButton);

    const reviewerRow = await screen.findByTestId(
      `grbReviewer-${contact.euaUserId}`
    );

    expect(within(reviewerRow).getByRole('cell', { name: contact.commonName }));
    expect(within(reviewerRow).getByRole('cell', { name: 'Non-voting' }));
    expect(within(reviewerRow).getByRole('cell', { name: 'QIO Rep' }));
  });

  it('renders duplicate reviewer warning', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            cedarContactsQuery('Je'),
            cedarContactsQuery('Jerry Seinfeld')
          ]}
        >
          <MessageProvider>
            <AddReviewerFromEua
              systemId={systemIntake.id}
              initialGRBReviewers={[grbReviewer]}
              createGRBReviewers={vi.fn()}
              grbReviewPath="/it-governance/123/grb-review"
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    const contactInput = screen.getByRole('combobox', {
      name: 'GRB member name *'
    });

    userEvent.type(contactInput, 'Je');
    userEvent.click(await screen.findByText(contactLabel));
    expect(contactInput).toHaveValue(contactLabel);

    const duplicateReviewerWarning = await screen.findByText(
      i18next.t<string>('grbReview:form.duplicateReviewerAlert')
    );

    expect(duplicateReviewerWarning).toBeInTheDocument();
  });
});
