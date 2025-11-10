import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SystemIntakeContactComponent,
  SystemIntakeContactFragment,
  SystemIntakeContactRole
} from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  getSystemIntakeContactsQuery,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';
import users from 'tests/mock/users';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import MockMessage from 'utils/testing/MockMessage';

import AddOrEditPointOfContact from './AddOrEdit';

const mockSystemIntakeId = systemIntake.id;

const mockContactToEdit: SystemIntakeContactFragment = {
  __typename: 'SystemIntakeContact',
  id: 'test-contact-1',
  systemIntakeId: mockSystemIntakeId,
  userAccount: {
    __typename: 'UserAccount',
    id: 'user-1',
    username: users[5].euaUserId,
    commonName: users[5].commonName,
    email: users[5].email
  },
  component: SystemIntakeContactComponent.CMS_WIDE,
  roles: [SystemIntakeContactRole.BUSINESS_OWNER],
  isRequester: false,
  createdAt: '2024-01-01T00:00:00Z'
};

const mockRequesterContact: SystemIntakeContactFragment = {
  __typename: 'SystemIntakeContact',
  id: 'test-contact-requester',
  systemIntakeId: mockSystemIntakeId,
  isRequester: true,
  userAccount: {
    __typename: 'UserAccount',
    id: 'user-requester',
    username: requester.userAccount.username,
    commonName: requester.userAccount.commonName,
    email: requester.userAccount.email
  },
  component: SystemIntakeContactComponent.CMS_WIDE,
  roles: [SystemIntakeContactRole.BUSINESS_OWNER],
  createdAt: '2024-01-01T00:00:00Z'
};

function renderWithProvider(
  mocks: MockedQuery[],
  type: 'add' | 'edit',
  contactToEdit?: SystemIntakeContactFragment
) {
  const initialEntries = [
    {
      pathname: `/it-governance/${mockSystemIntakeId}/team/point-of-contact/${type}`,
      state: contactToEdit ? { contact: contactToEdit } : undefined
    }
  ];

  return render(
    <MockedProvider mocks={mocks} addTypename>
      <MemoryRouter initialEntries={initialEntries}>
        <MessageProvider>
          <MockMessage />
          <Route path="/it-governance/:systemId/team/point-of-contact/:type">
            <AddOrEditPointOfContact systemIntake={systemIntake} type={type} />
          </Route>
        </MessageProvider>
      </MemoryRouter>
    </MockedProvider>
  );
}

describe('AddOrEditPointOfContact', () => {
  describe('POC alert conditional rendering', () => {
    it('renders the POC alert when adding a new contact', async () => {
      renderWithProvider([getSystemIntakeContactsQuery()], 'add');

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:addPOC.title')
          })
        ).toBeInTheDocument();
      });

      const alertText = i18next.t<string>('requestHome:addPOC.addAlert');
      expect(screen.getByText(alertText)).toBeInTheDocument();
    });

    it('does not render the POC alert when editing an existing contact', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockContactToEdit
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const alertText = i18next.t<string>('requestHome:addPOC.addAlert');
      expect(screen.queryByText(alertText)).not.toBeInTheDocument();
    });
  });

  describe('Requester checkbox conditional rendering', () => {
    it('renders the requester checkbox when adding a new contact', async () => {
      renderWithProvider([getSystemIntakeContactsQuery()], 'add');

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:addPOC.title')
          })
        ).toBeInTheDocument();
      });

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      expect(screen.getByText(checkboxLabel)).toBeInTheDocument();

      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });
      expect(checkbox).toBeInTheDocument();
    });

    it('renders the requester checkbox when editing a contact', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockContactToEdit
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      expect(screen.getByText(checkboxLabel)).toBeInTheDocument();

      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });
      expect(checkbox).toBeInTheDocument();
    });

    it('displays the correct hint text when adding a new contact', async () => {
      renderWithProvider([getSystemIntakeContactsQuery()], 'add');

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:addPOC.title')
          })
        ).toBeInTheDocument();
      });

      const hintText = i18next.t<string>('requestHome:addPOC.isRequesterHint');
      expect(screen.getByText(hintText)).toBeInTheDocument();
    });

    it('displays the correct hint text when editing a non-requester contact', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockContactToEdit
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const hintText = i18next.t<string>('requestHome:editPOC.changePrimary');
      expect(screen.getByText(hintText)).toBeInTheDocument();
    });
  });

  describe('Disabling the checkbox for current requester', () => {
    it('disables the requester checkbox when editing the current requester', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockRequesterContact
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });

      expect(checkbox).toBeDisabled();
      expect(checkbox).toBeChecked();
    });

    it('displays the correct disabled hint text for the current requester', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockRequesterContact
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const hintText = i18next.t<string>(
        'requestHome:editPOC.notRemovePrimary'
      );
      expect(screen.getByText(hintText)).toBeInTheDocument();
    });

    it('does not disable the requester checkbox for non-requester contacts', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockContactToEdit
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });

      expect(checkbox).not.toBeDisabled();
      expect(checkbox).not.toBeChecked();
    });

    it('allows toggling the requester checkbox for non-requester contacts', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockContactToEdit
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });

      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      expect(checkbox).toBeChecked();

      await user.click(checkbox);

      expect(checkbox).not.toBeChecked();
    });

    it('does not allow toggling the requester checkbox for the current requester', async () => {
      const user = userEvent.setup();
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockRequesterContact
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });

      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();

      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });
  });

  describe('Integration tests', () => {
    it('renders add form with alert and enabled checkbox', async () => {
      renderWithProvider([getSystemIntakeContactsQuery()], 'add');

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:addPOC.title')
          })
        ).toBeInTheDocument();
      });

      const alertText = i18next.t<string>('requestHome:addPOC.addAlert');
      expect(screen.getByText(alertText)).toBeInTheDocument();

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeDisabled();
      expect(checkbox).not.toBeChecked();
    });

    it('renders edit form without alert and with enabled checkbox for non-requester', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockContactToEdit
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const alertText = i18next.t<string>('requestHome:addPOC.addAlert');
      expect(screen.queryByText(alertText)).not.toBeInTheDocument();

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeDisabled();
      expect(checkbox).not.toBeChecked();
    });

    it('renders edit form without alert and with disabled checkbox for current requester', async () => {
      renderWithProvider(
        [getSystemIntakeContactsQuery()],
        'edit',
        mockRequesterContact
      );

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: i18next.t<string>('requestHome:editPOC.title')
          })
        ).toBeInTheDocument();
      });

      const alertText = i18next.t<string>('requestHome:addPOC.addAlert');
      expect(screen.queryByText(alertText)).not.toBeInTheDocument();

      const checkboxLabel = i18next.t<string>('requestHome:addPOC.isRequester');
      const checkbox = screen.getByRole('checkbox', { name: checkboxLabel });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeDisabled();
      expect(checkbox).toBeChecked();
    });
  });
});
