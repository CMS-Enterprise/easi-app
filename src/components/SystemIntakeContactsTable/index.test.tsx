import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import {
  SystemIntakeContactComponent,
  SystemIntakeContactFragment,
  SystemIntakeContactRole
} from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  businessOwner,
  getSystemIntakeContactsQuery,
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
  isRequester: false
};

describe('SystemIntakeContactsTable', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the contacts', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const allContacts: SystemIntakeContactFragment[] = [
      requester,
      businessOwner,
      productManager
    ];

    expect(screen.getAllByTestId('contact-row')).toHaveLength(
      allContacts.length
    );

    // Check that each contact renders in the table
    allContacts.forEach(contact => {
      expect(
        screen.getByRole('row', { name: `contact-${contact.id}` })
      ).toBeInTheDocument();
    });
  });

  it('displays requester icon for requester contact', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    expect(requesterRow).toBeInTheDocument();

    const icon = within(requesterRow).getByRole('img', {
      name: 'Primary requester'
    });

    expect(icon).toBeInTheDocument();
  });

  it('does not display requester icon for non-requester contacts', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const nonRequesterRow = screen.getByRole('row', {
      name: `contact-${businessOwner.id}`
    });

    const icon = within(nonRequesterRow).queryByRole('img', {
      name: 'Primary requester'
    });

    expect(icon).not.toBeInTheDocument();
  });

  it('displays contact names and emails', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

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

  it('displays component acronym', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    const component = requester.component!;

    expect(
      within(requesterRow).getByText(cmsComponents[component].acronym!)
    ).toBeInTheDocument();
  });

  it('displays "None specified" for empty component', async () => {
    render(
      <MockedProvider
        mocks={[
          getSystemIntakeContactsQuery([
            {
              ...additionalContact,
              component: null
            }
          ])
        ]}
      >
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText('None specified')).toBeInTheDocument();
  });

  it('displays translated role names', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

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

  it('displays "None specified" for empty roles', async () => {
    render(
      <MockedProvider
        mocks={[
          getSystemIntakeContactsQuery([
            {
              ...additionalContact,
              roles: []
            }
          ])
        ]}
      >
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText('None specified')).toBeInTheDocument();
  });

  it('renders edit and remove buttons for all contacts', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

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

  it('disables remove button for requester contact', async () => {
    render(
      <MockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const requesterRow = screen.getByRole('row', {
      name: `contact-${requester.id}`
    });

    const requesterRemoveButton = within(requesterRow).getByRole('button', {
      name: 'Remove'
    });

    expect(requesterRemoveButton).toBeDisabled();
  });
});
