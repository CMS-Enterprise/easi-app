import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { businessOwner, getCedarContactsQuery } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ContactFormModal from '.';

describe('ContactFormModal', () => {
  it('matches the snapshot', async () => {
    const { baseElement } = render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ContactFormModal
              systemIntakeId="123"
              type="contact"
              closeModal={() => {}}
              isOpen
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>,
      { baseElement: document.body }
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('disables submit button if fields are empty', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ContactFormModal
              systemIntakeId="123"
              type="contact"
              closeModal={() => {}}
              isOpen
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', {
        name: 'Add contact'
      })
    ).toBeDisabled();
  });

  it('renders default values if initialValues are provided', async () => {
    const { userAccount } = businessOwner;
    const contactLabel = `${userAccount.commonName}, ${userAccount.username} (${userAccount.email})`;

    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getCedarContactsQuery(contactLabel, {
              __typename: 'UserInfo',
              commonName: userAccount.commonName,
              email: userAccount.email,
              euaUserId: userAccount.username
            })
          ]}
        >
          <MessageProvider>
            <ContactFormModal
              systemIntakeId="123"
              type="contact"
              closeModal={() => {}}
              isOpen
              initialValues={businessOwner}
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    // Name field should be disabled
    expect(
      screen.getByRole('combobox', {
        name: 'Contact name *'
      })
    ).toBeDisabled();

    expect(
      screen.getByRole('combobox', {
        name: 'Contact name *'
      })
    ).toHaveValue(contactLabel);

    expect(
      screen.getByRole('combobox', {
        name: 'Contact component *'
      })
    ).toHaveValue(businessOwner.component);

    expect(
      screen.getByTestId('multiselect-tag--Business Owner')
    ).toBeInTheDocument();
  });
});
