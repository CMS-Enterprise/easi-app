import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { systemIntake } from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import {
  CreateSystemIntakeGRBReviewerQuery,
  GetSystemIntakeGRBReviewersQuery
} from 'queries/SystemIntakeGRBReviewerQueries';
import {
  CreateSystemIntakeGRBReviewer,
  CreateSystemIntakeGRBReviewerVariables
} from 'queries/types/CreateSystemIntakeGRBReviewer';
import {
  GetCedarContacts,
  GetCedarContactsVariables
} from 'queries/types/GetCedarContacts';
import {
  GetSystemIntakeGRBReviewers,
  GetSystemIntakeGRBReviewersVariables
} from 'queries/types/GetSystemIntakeGRBReviewers';
import { SystemIntakeGRBReviewer } from 'queries/types/SystemIntakeGRBReviewer';
import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import MockUsers from 'utils/testing/MockUsers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import IsGrbViewContext from '../IsGrbViewContext';

import GRBReview from '.';

const mockUsers = new MockUsers();
const user = mockUsers.findByCommonName('Jerry Seinfeld')!;
const contact = user.userInfo;

const contactLabel = `${contact.commonName}, ${contact.euaUserId} (${contact.email})`;

const grbReviewer: SystemIntakeGRBReviewer = {
  __typename: 'SystemIntakeGRBReviewer',
  id: '5b78f877-2848-40b2-a123-96872c40f744',
  userAccount: {
    __typename: 'UserAccount',
    id: '6867f3b6-283f-492b-a180-2066470e2a0a',
    commonName: contact.commonName,
    email: contact.commonName,
    username: contact.euaUserId
  },
  votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
  grbRole: SystemIntakeGRBReviewerRole.CMCS_REP
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

const createSystemIntakeGRBReviewerQuery: MockedQuery<
  CreateSystemIntakeGRBReviewer,
  CreateSystemIntakeGRBReviewerVariables
> = {
  request: {
    query: CreateSystemIntakeGRBReviewerQuery,
    variables: {
      input: {
        systemIntakeID: systemIntake.id,
        euaUserId: contact.euaUserId,
        votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
        grbRole: SystemIntakeGRBReviewerRole.CMCS_REP
      }
    }
  },
  result: {
    data: {
      createSystemIntakeGRBReviewer: {
        ...grbReviewer
      }
    }
  }
};

const getSystemIntakeGRBReviewersQuery: MockedQuery<
  GetSystemIntakeGRBReviewers,
  GetSystemIntakeGRBReviewersVariables
> = {
  request: {
    query: GetSystemIntakeGRBReviewersQuery,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      systemIntake: {
        __typename: 'SystemIntake',
        id: systemIntake.id,
        grbReviewers: [grbReviewer]
      }
    }
  }
};

describe('GRB reviewer form', () => {
  it('adds a GRB reviewer', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntake.id}/grb-review/add`,
          `/governance-review-team/${systemIntake.id}/grb-review`
        ]}
      >
        <VerboseMockedProvider
          mocks={[
            cedarContactsQuery('Je'),
            cedarContactsQuery('Jerry Seinfeld'),
            createSystemIntakeGRBReviewerQuery,
            getSystemIntakeGRBReviewersQuery,
            getSystemIntakeGRBReviewersQuery
          ]}
        >
          <MessageProvider>
            <Route path="/:reviewerType/:systemId/grb-review/:action">
              <IsGrbViewContext.Provider value>
                <GRBReview {...systemIntake} grbReviewers={[]} />
              </IsGrbViewContext.Provider>
            </Route>
            <Route path="/:reviewerType/:systemId/grb-review">
              <IsGrbViewContext.Provider value>
                <GRBReview {...systemIntake} grbReviewers={[grbReviewer]} />
              </IsGrbViewContext.Provider>
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Add a GRB reviewer' }));

    const contactInput = screen.getByRole('combobox', {
      name: 'GRB member name *'
    });

    userEvent.type(contactInput, 'Je');
    userEvent.click(await screen.findByText(contactLabel));
    expect(contactInput).toHaveValue(contactLabel);

    const votingRoleField = screen.getByRole('combobox', {
      name: 'Voting role *'
    });
    userEvent.selectOptions(votingRoleField, 'VOTING');
    expect(votingRoleField).toHaveValue('VOTING');

    const grbRoleField = screen.getByRole('combobox', { name: 'GRB role *' });
    userEvent.selectOptions(grbRoleField, 'CMCS_REP');
    expect(grbRoleField).toHaveValue('CMCS_REP');

    const submitButton = screen.getByRole('button', { name: 'Add reviewer' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(submitButton).not.toBeDisabled();
    userEvent.click(submitButton);

    expect(await screen.findByText('Jerry Seinfeld (Voting) - CMCS Rep'));
  });
});
