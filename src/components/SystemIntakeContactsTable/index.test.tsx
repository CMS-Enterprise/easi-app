import React from 'react';
import { render, screen, within } from '@testing-library/react';
import {
  GetSystemIntakeContactsQuery,
  SystemIntakeContactComponent,
  SystemIntakeContactFragment,
  SystemIntakeContactRole
} from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  businessOwner,
  productManager,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';

import cmsComponents from 'constants/cmsComponents';

import SystemIntakeContactsTable from './index';

const additionalContact: SystemIntakeContactFragment = {
  __typename: 'SystemIntakeContact',
  systemIntakeId: systemIntake.id,
  id: '5783ca62-eafd-436e-aba1-1b74f37638be',
  userAccount: {
    __typename: 'UserAccount',
    id: '1811922d-e9a1-4727-903d-217c3cd4470a',
    username: 'USR1',
    commonName: 'User One',
    email: 'user.one@local.fake'
  },
  component: SystemIntakeContactComponent.OFFICE_OF_LEGISLATION,
  roles: [SystemIntakeContactRole.OTHER],
  isRequester: false,
  createdAt: '2025-09-23T15:58:46.72809Z'
};

const systemIntakeContacts: GetSystemIntakeContactsQuery['systemIntakeContacts'] =
  {
    __typename: 'SystemIntakeContacts',
    requester,
    businessOwners: [businessOwner],
    productManagers: [productManager],
    additionalContacts: [],
    allContacts: [requester, businessOwner, productManager]
  };

describe('SystemIntakeContactsTable', () => {
  it('renders the contacts', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    expect(screen.getAllByTestId('contact-row')).toHaveLength(
      systemIntakeContacts.allContacts.length
    );

    // Check that each contact renders in the table
    systemIntakeContacts.allContacts.forEach(contact => {
      expect(
        screen.getByRole('row', { name: `contact-${contact.id}` })
      ).toBeInTheDocument();
    });
  });

  it('displays requester icon for requester contact', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    expect(requesterRow).toBeInTheDocument();

    const icon = within(requesterRow).getByRole('img', {
      name: 'Primary requester'
    });

    expect(icon).toBeInTheDocument();
  });

  it('does not display requester icon for non-requester contacts', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    const nonRequesterRow = screen.getByRole('row', {
      name: `contact-${businessOwner.id}`
    });

    const icon = within(nonRequesterRow).queryByRole('img', {
      name: 'Primary requester'
    });

    expect(icon).not.toBeInTheDocument();
  });

  it('displays contact names and emails', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    expect(
      within(requesterRow).getByText(requester.userAccount.commonName)
    ).toBeInTheDocument();
    expect(
      within(requesterRow).getByText(requester.userAccount.email)
    ).toBeInTheDocument();
  });

  it('displays component acronym', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    const component = requester.component!;

    expect(
      within(requesterRow).getByText(cmsComponents[component].acronym!)
    ).toBeInTheDocument();
  });

  it('displays "None specified" for empty component', () => {
    const contactWithoutComponent: SystemIntakeContactFragment = {
      ...additionalContact,
      component: null
    };

    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={{
          ...systemIntakeContacts,
          additionalContacts: [contactWithoutComponent],
          allContacts: [
            ...systemIntakeContacts.allContacts,
            contactWithoutComponent
          ]
        }}
        loading={false}
      />
    );

    expect(screen.getByText('None specified')).toBeInTheDocument();
  });

  it('displays translated role names', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    const requesterRow = screen.getByRole('row', {
      name: `contact-${businessOwner.id}`
    });

    // Check that role is displayed (translated)
    expect(
      within(requesterRow).getByText(
        i18next.t<string>(
          `intake:contactDetails.systemIntakeContactRoles.${businessOwner.roles[0]}`
        )
      )
    ).toBeInTheDocument();
  });

  it('displays "None specified" for empty roles', () => {
    const contactWithoutRoles: SystemIntakeContactFragment = {
      ...additionalContact,
      roles: []
    };

    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={{
          ...systemIntakeContacts,
          additionalContacts: [contactWithoutRoles],
          allContacts: [
            ...systemIntakeContacts.allContacts,
            contactWithoutRoles
          ]
        }}
        loading={false}
      />
    );

    expect(screen.getByText('None specified')).toBeInTheDocument();
  });

  it('renders action buttons for all contacts', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
        handleEditContact={() => vi.fn()}
      />
    );

    const businessOwnerRow = screen.getByRole('row', {
      name: `contact-${businessOwner.id}`
    });

    expect(
      within(businessOwnerRow).getByRole('button', { name: 'Edit' })
    ).toBeInTheDocument();
    expect(
      within(businessOwnerRow).getByRole('button', { name: 'Remove' })
    ).toBeInTheDocument();
  });

  it('hides action buttons if handleEditContact is not provided', () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove' })
    ).not.toBeInTheDocument();
  });

  it('disables remove button for requester contact', async () => {
    render(
      <SystemIntakeContactsTable
        systemIntakeContacts={systemIntakeContacts}
        loading={false}
        handleEditContact={() => vi.fn()}
      />
    );

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    const requesterRemoveButton = within(requesterRow).getByRole('button', {
      name: 'Remove'
    });

    expect(requesterRemoveButton).toBeDisabled();
  });
});
