import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetCedarContactsDocument,
  GetCedarContactsQuery,
  GetCedarContactsQueryVariables
} from 'gql/generated/graphql';
import {
  attendees,
  getTRBRequestAttendeesQuery,
  newAttendee,
  requester
} from 'tests/mock/trbRequest';

import { CMS_TRB_EMAIL } from 'constants/externalUrls';
import { MessageProvider } from 'hooks/useMessage';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import useActionForm from './useActionForm';

const cedarContactsMock = (
  query: string
): MockedQuery<GetCedarContactsQuery, GetCedarContactsQueryVariables> => ({
  request: {
    query: GetCedarContactsDocument,
    variables: {
      commonName: query
    }
  },
  result: {
    data: {
      __typename: 'Query',
      cedarPersonsByCommonName: [newAttendee.userInfo]
    }
  }
});

const store = easiMockStore({ groups: ['EASI_TRB_ADMIN_D'] });

const Form = () => {
  const { ActionForm } = useActionForm<TrbRecipientFields>({
    trbRequestId: requester?.trbRequestId
  });
  return (
    <ActionForm
      title="form title"
      description="Form description"
      breadcrumbItems={[{ text: 'Page title' }]}
      onSubmit={() => null}
    />
  );
};

describe('Email recipient fields component', () => {
  it('renders recipients', async () => {
    const { getAllByRole, getByRole, asFragment } = render(
      <Provider store={store}>
        <VerboseMockedProvider mocks={[getTRBRequestAttendeesQuery]}>
          <MemoryRouter>
            <MessageProvider>
              <Form />
            </MessageProvider>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await waitForElementToBeRemoved(() => getByRole('progressbar'));

    // Requester and Copy TRB Mailbox checkboxes rendered by default
    expect(getAllByRole('checkbox').length).toBe(2);

    const requesterCheckbox = getByRole('checkbox', {
      name: `${requester.userInfo?.commonName}, CMS (Requester) ${requester.userInfo?.email}`
    });
    expect(requesterCheckbox).toBeChecked();

    expect(
      getByRole('checkbox', { name: `Copy TRB Mailbox ${CMS_TRB_EMAIL}` })
    ).toBeChecked();

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
    const { getByRole, findByText } = render(
      <Provider store={store}>
        <VerboseMockedProvider
          mocks={[
            getTRBRequestAttendeesQuery,
            cedarContactsMock('Av'),
            cedarContactsMock('Avis Anderson')
          ]}
        >
          <MemoryRouter>
            <MessageProvider>
              <Form />
            </MessageProvider>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await waitForElementToBeRemoved(() => getByRole('progressbar'));

    userEvent.click(
      getByRole('button', {
        name: `Show ${attendees.length} more recipients`
      })
    );

    userEvent.click(getByRole('button', { name: 'Add another recipient' }));

    const submitButton = getByRole('button', { name: 'Add recipient' });
    expect(submitButton).toBeDisabled();

    userEvent.type(
      getByRole('combobox', { name: 'New recipient name *' }),
      'Av'
    );

    await waitForElementToBeRemoved(() => getByRole('progressbar'));

    userEvent.click(
      await findByText(
        `${newAttendee.userInfo?.commonName}, ${newAttendee.userInfo?.euaUserId} (${newAttendee.userInfo?.email})`
      )
    );

    const componentSelect = getByRole('combobox', {
      name: 'New recipient component'
    });
    userEvent.selectOptions(componentSelect, [newAttendee.component!]);
    expect(componentSelect).toHaveValue(newAttendee.component);

    const roleSelect = getByRole('combobox', {
      name: 'New recipient role *'
    });
    userEvent.selectOptions(roleSelect, [newAttendee.role!]);
    expect(roleSelect).toHaveValue(newAttendee.role);
  });
});
