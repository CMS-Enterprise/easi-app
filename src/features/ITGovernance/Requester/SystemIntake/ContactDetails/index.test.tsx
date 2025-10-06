import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import {
  GetSystemIntakeContactsDocument,
  GetSystemIntakeContactsQuery,
  SystemIntakeContactFragment
} from 'gql/generated/graphql';
import {
  emptySystemIntake,
  getSystemIntakeQuery,
  requester
} from 'tests/mock/systemIntake';

import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ContactDetails from '.';

const emptyRequester: SystemIntakeContactFragment = {
  ...requester,
  component: null,
  roles: []
};

const getSystemIntakeContactsQuery: MockedQuery<GetSystemIntakeContactsQuery> =
  {
    request: {
      query: GetSystemIntakeContactsDocument,
      variables: {
        id: emptySystemIntake.id
      }
    },
    result: {
      data: {
        __typename: 'Query',
        systemIntakeContacts: {
          __typename: 'SystemIntakeContacts',
          requester: emptyRequester,
          businessOwners: [],
          productManagers: [],
          additionalContacts: [],
          allContacts: [emptyRequester]
        }
      }
    }
  };

describe('System intake form - Contact details', () => {
  it('renders fields for new request', async () => {
    render(
      <VerboseMockedProvider
        addTypename
        mocks={[
          getSystemIntakeQuery(emptySystemIntake),
          getSystemIntakeContactsQuery
        ]}
      >
        <ContactDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(
      screen.getByRole('heading', { name: 'Contact details' })
    ).toBeInTheDocument();

    const requesterRow = screen.getByRole('row', {
      name: `contact-${emptyRequester?.userAccount.username}`
    });

    expect(
      within(requesterRow).getByText(emptyRequester?.userAccount.commonName!)
    ).toBeInTheDocument();

    expect(within(requesterRow).getAllByText('None specified')).toHaveLength(2);

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
