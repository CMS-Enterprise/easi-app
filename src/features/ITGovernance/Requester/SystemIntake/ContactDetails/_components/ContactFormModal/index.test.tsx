import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  businessOwner,
  getCedarContactsQuery,
  getSystemIntakeContactsQuery
} from 'tests/mock/systemIntake';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ContactFormModal from '.';

describe('ContactFormModal', () => {
  it('matches the snapshot', async () => {
    const { baseElement } = render(
      <VerboseMockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <ContactFormModal
          systemIntakeId={businessOwner.systemIntakeId}
          type="contact"
          closeModal={() => {}}
          isOpen
        />
      </VerboseMockedProvider>,
      { baseElement: document.body }
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('disables submit button if fields are empty', async () => {
    render(
      <VerboseMockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <ContactFormModal
          systemIntakeId={businessOwner.systemIntakeId}
          type="contact"
          closeModal={() => {}}
          isOpen
        />
      </VerboseMockedProvider>
    );

    expect(screen.getByRole('button', { name: 'Add contact' })).toBeDisabled();
  });

  it('renders default values if initialValues are provided', async () => {
    const { userAccount } = businessOwner;
    const contactLabel = `${userAccount.commonName}, ${userAccount.username} (${userAccount.email})`;

    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery(),
          getCedarContactsQuery(contactLabel, {
            __typename: 'UserInfo',
            commonName: userAccount.commonName,
            email: userAccount.email,
            euaUserId: userAccount.username
          })
        ]}
      >
        <ContactFormModal
          systemIntakeId={businessOwner.systemIntakeId}
          type="contact"
          closeModal={() => {}}
          isOpen
          initialValues={businessOwner}
        />
      </VerboseMockedProvider>
    );

    // Name field should be disabled
    expect(
      screen.getByRole('combobox', { name: 'Contact name' })
    ).toBeDisabled();

    expect(screen.getByRole('combobox', { name: 'Contact name' })).toHaveValue(
      contactLabel
    );

    expect(
      screen.getByRole('combobox', { name: 'Contact component' })
    ).toHaveValue(businessOwner.component);

    expect(
      screen.getByTestId('multiselect-tag--Business Owner')
    ).toBeInTheDocument();
  });
});
