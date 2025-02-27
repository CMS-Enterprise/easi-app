import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import {
  GetCedarContactsDocument,
  GetCedarContactsQuery,
  GetCedarContactsQueryVariables,
  GetSystemIntakeContactsDocument
} from 'gql/generated/graphql';
import { getSystemIntakeQuery, systemIntake } from 'tests/mock/systemIntake';

import { SystemIntakeContactProps } from 'types/systemIntake';
import { MockedQuery } from 'types/util';

import AdditionalContacts from './index';

// Mock logged in user
vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: async () => ({
          name: 'Adeline Aarons',
          preferred_usename: 'ABCD',
          email: 'adeline.aarons@local.fake'
        })
      }
    };
  }
}));

/** Additional Contacts */
const additionalContacts: SystemIntakeContactProps[] = [
  {
    systemIntakeId: systemIntake.id,
    id: '4828a0b0-9474-4ddc-8fc2-662323ef0087',
    commonName: 'Jerry Seinfeld',
    email: 'jerry.seinfeld@local.fake',
    euaUserId: 'SF13',
    component: 'Office of Information Technology',
    role: 'Cloud Navigator'
  },
  {
    systemIntakeId: systemIntake.id,
    id: 'fa706702-45ab-43fe-ad90-68ff681313af',
    commonName: 'Cosmo Kramer',
    email: 'cosmo.kramer@local.fake',
    euaUserId: 'KR14',
    component: 'Other',
    role: 'System Maintainer'
  }
];

/** System intake contacts query mock */
const systemIntakeContactsQuery = {
  request: {
    query: GetSystemIntakeContactsDocument,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      systemIntakeContacts: {
        systemIntakeContacts: additionalContacts
      }
    }
  }
};

// Cedar contacts query mock
const cedarContactsQuery: MockedQuery<
  GetCedarContactsQuery,
  GetCedarContactsQueryVariables
> = {
  request: {
    query: GetCedarContactsDocument,
    variables: {
      commonName: 'Jerry Seinfeld, SF13 (jerry.seinfeld@local.fake)'
    }
  },
  result: {
    data: {
      __typename: 'Query',
      cedarPersonsByCommonName: [
        {
          __typename: 'UserInfo',
          commonName: additionalContacts[0].commonName,
          email: additionalContacts[0].email,
          euaUserId: additionalContacts[0].euaUserId!
        }
      ]
    }
  }
};

describe('Additional contacts component', () => {
  it('renders without crashing', async () => {
    const { asFragment, getByTestId, getByRole } = render(
      <MockedProvider
        mocks={[getSystemIntakeQuery(), systemIntakeContactsQuery]}
        addTypename={false}
      >
        <AdditionalContacts
          systemIntakeId={systemIntake.id}
          activeContact={null}
          setActiveContact={() => null}
          contacts={additionalContacts}
        />
      </MockedProvider>
    );

    // Initial snapshot with list of additional contacts
    expect(asFragment()).toMatchSnapshot();

    // Check that contacts list rendered
    expect(
      getByTestId('systemIntakeContacts__contactsList')
    ).toBeInTheDocument();

    // Check for specific additional contacts
    expect(
      getByTestId(`systemIntakeContact-${additionalContacts[0].id}`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`systemIntakeContact-${additionalContacts[1].id}`)
    ).toBeInTheDocument();

    // Check for add another contact button
    expect(
      getByRole('button', {
        name: 'Add another contact'
      })
    ).toBeInTheDocument();
  });

  it('displays form when editing contact', async () => {
    // Get first additional contact in array
    const activeContact = additionalContacts[0];

    // Render component with edit form
    const { asFragment, getByTestId, findByTestId } = render(
      <MockedProvider
        mocks={[
          getSystemIntakeQuery(),
          systemIntakeContactsQuery,
          cedarContactsQuery
        ]}
        addTypename={false}
      >
        <AdditionalContacts
          systemIntakeId={systemIntake.id}
          // Set active contact values to display edit form
          activeContact={{
            systemIntakeId: systemIntake.id,
            id: activeContact.id,
            commonName: activeContact.commonName,
            email: activeContact.email,
            euaUserId: activeContact.euaUserId,
            component: activeContact.component,
            role: activeContact.role
          }}
          setActiveContact={() => null}
          contacts={additionalContacts}
        />
      </MockedProvider>
    );

    // Wait for cedar contacts query to complete
    await waitForElementToBeRemoved(() =>
      getByTestId('systemIntakeContactForm').querySelector('.easi-spinner')
    );

    // Check that contact select field displays correct value
    const cedarContactSelectInput = await findByTestId('cedar-contact-select');
    expect(cedarContactSelectInput).toHaveValue(
      `${activeContact.commonName}, ${activeContact.euaUserId} (${activeContact.email})`
    );

    // Check that component field displays correct value
    const componentField = getByTestId('IntakeForm-ContactComponent');
    expect(componentField).toHaveValue(activeContact.component);

    // Check that role field displays correct value
    const roleField = getByTestId('IntakeForm-ContactRole');
    expect(roleField).toHaveValue(activeContact.role);

    // Edit form snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
