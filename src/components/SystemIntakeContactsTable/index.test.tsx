import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
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

import cmsComponentsMap from 'constants/cmsComponentsMap';

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

const systemIntakeContacts: SystemIntakeContactFragment[] = [
  requester,
  businessOwner,
  productManager
];

describe('SystemIntakeContactsTable', () => {
  it('renders the contacts', () => {
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

    expect(screen.getAllByTestId('contact-row')).toHaveLength(
      systemIntakeContacts.length
    );

    // Check that each contact renders in the table
    systemIntakeContacts.forEach(contact => {
      expect(
        screen.getByRole('row', { name: `contact-${contact.id}` })
      ).toBeInTheDocument();
    });
  });

  it('displays requester icon for requester contact', () => {
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

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
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

    const nonRequesterRow = screen.getByRole('row', {
      name: `contact-${businessOwner.id}`
    });

    const icon = within(nonRequesterRow).queryByRole('img', {
      name: 'Primary requester'
    });

    expect(icon).not.toBeInTheDocument();
  });

  it('displays contact names and emails', () => {
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

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
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    const component = requester.component!;

    expect(
      within(requesterRow).getByText(cmsComponentsMap[component].acronym!)
    ).toBeInTheDocument();
  });

  it('displays "None specified" for empty component', () => {
    const contactWithoutComponent: SystemIntakeContactFragment = {
      ...additionalContact,
      component: null
    };

    render(
      <SystemIntakeContactsTable
        contacts={[...systemIntakeContacts, contactWithoutComponent]}
      />
    );

    expect(screen.getByText('None specified')).toBeInTheDocument();
  });

  it('displays translated role names', () => {
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

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
        contacts={[...systemIntakeContacts, contactWithoutRoles]}
      />
    );

    expect(screen.getByText('None specified')).toBeInTheDocument();
  });

  it('renders action buttons for all contacts', () => {
    render(
      <SystemIntakeContactsTable
        contacts={systemIntakeContacts}
        handleEditContact={() => vi.fn()}
        removeContact={() => vi.fn()}
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

  it('hides action buttons if `handleEditContact` and `removeContact` are not provided', () => {
    render(<SystemIntakeContactsTable contacts={systemIntakeContacts} />);

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
        contacts={systemIntakeContacts}
        handleEditContact={() => vi.fn()}
        removeContact={() => vi.fn()}
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

  it('renders remove modal when button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SystemIntakeContactsTable
        contacts={systemIntakeContacts}
        handleEditContact={() => vi.fn()}
        removeContact={() => vi.fn()}
      />
    );

    const businessOwnerRow = screen.getByRole('row', {
      name: `contact-${businessOwner.id}`
    });

    const businessOwnerRemoveButton = within(businessOwnerRow).getByRole(
      'button',
      {
        name: 'Remove'
      }
    );

    await user.click(businessOwnerRemoveButton);

    expect(
      await screen.findByRole('heading', {
        name: 'Are you sure you want to remove this team member or point of contact?'
      })
    ).toBeInTheDocument();
  });
});
