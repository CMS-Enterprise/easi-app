import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { attendees as mockAttendees, requester } from 'data/mock/trbRequest';
import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';

import EmailRecipientFields from '.';

const [newAttendee, ...attendees] = mockAttendees;
const { trbRequestId } = requester;

const cedarContactsMock = (commonName: string) => ({
  request: {
    query: GetCedarContactsQuery,
    variables: {
      commonName
    }
  },
  result: {
    data: {
      cedarPersonsByCommonName: [newAttendee.userInfo]
    }
  }
});

const TestComponent = () => {
  const formMethods = useForm({
    defaultValues: {
      trbRequestId,
      notifyEuaIds: [requester.userInfo?.euaUserId],
      copyTrbMailbox: true
    }
  });
  return (
    <MockedProvider
      mocks={[cedarContactsMock('Al'), cedarContactsMock('Ally Anderson')]}
    >
      <FormProvider {...formMethods}>
        <EmailRecipientFields
          requester={requester}
          contacts={attendees}
          mailboxes={[{ key: 'copyTrbMailbox', label: 'Copy TRB Mailbox' }]}
          createContact={() => Promise.resolve()}
        />
      </FormProvider>
    </MockedProvider>
  );
};

describe('Email recipient fields component', () => {
  it('renders recipients', async () => {
    const { getAllByRole, getByRole, asFragment } = render(<TestComponent />);

    // Requester and Copy TRB Mailbox checkboxes rendered by default
    expect(getAllByRole('checkbox').length).toBe(2);

    const requesterCheckbox = getByRole('checkbox', {
      name: `${requester.userInfo?.commonName}, ${requester.component} (Requester)`
    });
    expect(requesterCheckbox).toBeChecked();

    expect(getByRole('checkbox', { name: 'Copy TRB Mailbox' })).toBeChecked();

    // Expand recipients list
    userEvent.click(
      getByRole('button', {
        name: `Show ${attendees.length} more recipients`
      })
    );

    expect(getAllByRole('checkbox').length).toBe(2 + attendees.length);

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders Add Attendee form', async () => {
    const { asFragment, getByRole, findByText } = render(<TestComponent />);

    userEvent.click(
      getByRole('button', {
        name: `Show ${attendees.length} more recipients`
      })
    );

    userEvent.click(getByRole('button', { name: 'Add another recipient' }));

    const submitButton = getByRole('button', { name: 'Add recipient' });
    expect(submitButton).toBeDisabled();

    userEvent.type(getByRole('combobox', { name: 'Cedar-Users' }), 'Al');
    userEvent.click(
      await findByText(
        `${newAttendee.userInfo?.commonName}, ${newAttendee.userInfo?.euaUserId}`
      )
    );

    const componentSelect = getByRole('combobox', {
      name: 'New recipient component'
    });
    userEvent.selectOptions(componentSelect, [newAttendee.component!]);
    expect(componentSelect).toHaveValue(newAttendee.component);

    const roleSelect = getByRole('combobox', {
      name: 'New recipient role'
    });
    userEvent.selectOptions(roleSelect, [newAttendee.role!]);
    expect(roleSelect).toHaveValue(newAttendee.role);

    expect(asFragment()).toMatchSnapshot();
  });
});
