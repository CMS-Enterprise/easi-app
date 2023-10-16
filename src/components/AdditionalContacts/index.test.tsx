import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';

import { GetSystemIntakeContactsQuery } from 'queries/SystemIntakeContactsQueries';
import { SystemIntakeContactProps } from 'types/systemIntake';

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

describe('Additional contacts component', () => {
  /** System intake ID */
  const intakeId = '1d9a5930-276c-4bd1-9eeb-d23e42fe35e8';

  /** Additional Contacts */
  const additionalContacts: SystemIntakeContactProps[] = [
    {
      systemIntakeId: intakeId,
      id: '4828a0b0-9474-4ddc-8fc2-662323ef0087',
      commonName: 'Jerry Seinfeld',
      email: 'jerry.seinfeld@local.fake',
      euaUserId: 'SF13',
      component: 'Office of Information Technology',
      role: 'Cloud Navigator'
    },
    {
      systemIntakeId: intakeId,
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
      query: GetSystemIntakeContactsQuery,
      variables: {
        id: intakeId
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

  it('renders without crashing', async () => {
    const { asFragment, getByTestId, getByRole } = render(
      <MockedProvider mocks={[systemIntakeContactsQuery]} addTypename={false}>
        <AdditionalContacts
          systemIntakeId={intakeId}
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
      <MockedProvider mocks={[systemIntakeContactsQuery]} addTypename={false}>
        <AdditionalContacts
          systemIntakeId={intakeId}
          // Set active contact values to display edit form
          activeContact={{
            systemIntakeId: intakeId,
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
