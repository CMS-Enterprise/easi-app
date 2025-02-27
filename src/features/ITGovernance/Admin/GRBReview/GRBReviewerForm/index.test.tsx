import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ITGovAdminContext from 'features/ITGovernance/Admin/ITGovAdminContext';
import {
  CreateSystemIntakeGRBReviewersDocument,
  CreateSystemIntakeGRBReviewersMutation,
  CreateSystemIntakeGRBReviewersMutationVariables,
  GetGRBReviewersComparisonsDocument,
  GetGRBReviewersComparisonsQuery,
  GetGRBReviewersComparisonsQueryVariables,
  GetSystemIntakeGRBReviewersDocument,
  GetSystemIntakeGRBReviewersQuery,
  GetSystemIntakeGRBReviewersQueryVariables,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  UpdateSystemIntakeGRBReviewerDocument,
  UpdateSystemIntakeGRBReviewerMutation,
  UpdateSystemIntakeGRBReviewerMutationVariables
} from 'gql/generated/graphql';
import GetCedarContactsQuery from 'gql/legacyGQL/GetCedarContactsQuery';
import {
  GetCedarContacts,
  GetCedarContactsVariables
} from 'gql/legacyGQL/types/GetCedarContacts';
import i18next from 'i18next';
import { businessCase } from 'tests/mock/businessCase';
import { systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import MockUsers from 'utils/testing/MockUsers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GRBReview from '..';

import AddReviewerFromEua from './AddReviewerFromEua';

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
): MockedQuery<GetCedarContacts, GetCedarContactsVariables> => ({
  request: {
    query: GetCedarContactsQuery,
    variables: {
      commonName
    }
  },
  result: {
    data: {
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

const getSystemIntakeGRBReviewersQuery = (
  reviewer?: SystemIntakeGRBReviewerFragment
): MockedQuery<
  GetSystemIntakeGRBReviewersQuery,
  GetSystemIntakeGRBReviewersQueryVariables
> => ({
  request: {
    query: GetSystemIntakeGRBReviewersDocument,
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
        grbReviewers: reviewer ? [reviewer] : [],
        grbReviewStartedAt: null
      }
    }
  }
});

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

describe('GRB reviewer form', () => {
  it('adds a GRB reviewer', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${systemIntake.id}/grb-review/add`,
          `/it-governance/${systemIntake.id}/grb-review`
        ]}
      >
        <VerboseMockedProvider
          mocks={[
            getGRBReviewersComparisonsQuery,
            cedarContactsQuery('Je'),
            cedarContactsQuery('Jerry Seinfeld'),
            createSystemIntakeGRBReviewersQuery,
            getSystemIntakeGRBReviewersQuery(),
            getSystemIntakeGRBReviewersQuery(grbReviewer)
          ]}
        >
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:action">
              <ITGovAdminContext.Provider value>
                <GRBReview
                  {...systemIntake}
                  businessCase={businessCase}
                  grbReviewers={[]}
                />
              </ITGovAdminContext.Provider>
            </Route>
            <Route path="/it-governance/:systemId/grb-review">
              <ITGovAdminContext.Provider value>
                <GRBReview
                  {...systemIntake}
                  businessCase={businessCase}
                  grbReviewers={[grbReviewer]}
                />
              </ITGovAdminContext.Provider>
            </Route>
          </MessageProvider>
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
          },
          `/it-governance/${systemIntake.id}/grb-review`
        ]}
      >
        <VerboseMockedProvider
          mocks={[
            getGRBReviewersComparisonsQuery,
            cedarContactsQuery(contactLabel),
            updateSystemIntakeGRBReviewerQuery,
            getSystemIntakeGRBReviewersQuery(grbReviewer),
            getSystemIntakeGRBReviewersQuery(updatedGRBReviewer)
          ]}
        >
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:action">
              <ITGovAdminContext.Provider value>
                <GRBReview
                  {...systemIntake}
                  businessCase={businessCase}
                  grbReviewers={[grbReviewer]}
                />
              </ITGovAdminContext.Provider>
            </Route>
            <Route path="/it-governance/:systemId/grb-review">
              <ITGovAdminContext.Provider value>
                <GRBReview
                  {...systemIntake}
                  businessCase={businessCase}
                  grbReviewers={[updatedGRBReviewer]}
                />
              </ITGovAdminContext.Provider>
            </Route>
          </MessageProvider>
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
              setReviewerToRemove={vi.fn()}
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
