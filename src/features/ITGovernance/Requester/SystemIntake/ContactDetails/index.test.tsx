import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetSystemIntakeContactsDocument,
  GetSystemIntakeContactsQuery
} from 'gql/generated/graphql';
import {
  emptySystemIntake,
  getSystemIntakeQuery
} from 'tests/mock/systemIntake';

import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ContactDetails from '.';

const getSystemIntakeContactsQuery: MockedQuery<GetSystemIntakeContactsQuery> =
  {
    request: {
      query: GetSystemIntakeContactsDocument,
      variables: {
        id: emptySystemIntake.id
      }
    },
    result: {
      data: {
        __typename: 'Query',
        systemIntakeContacts: []
      }
    }
  };

describe('System intake form - Contact details', () => {
  it('renders fields for new request', async () => {
    render(
      <VerboseMockedProvider
        addTypename
        mocks={[
          getSystemIntakeQuery(emptySystemIntake),
          getSystemIntakeContactsQuery
        ]}
      >
        <ContactDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(
      screen.getByRole('heading', { name: 'Contact details' })
    ).toBeInTheDocument();

    // Requester name is filled in
    expect(screen.getByRole('textbox', { name: 'Requester' })).toHaveValue(
      emptySystemIntake.requester.name
    );
  });

  it('renders error messages', async () => {
    const user = userEvent.setup();
    render(
      <VerboseMockedProvider
        addTypename
        mocks={[
          getSystemIntakeQuery(emptySystemIntake),
          getSystemIntakeContactsQuery
        ]}
      >
        <ContactDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    // Submit empty form
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(
      await screen.findByRole('heading', {
        name: 'Please check and fix the following'
      })
    ).toBeInTheDocument();

    const errorSummary = screen.getByTestId('contact-details-errors');

    expect(
      within(errorSummary).getByText("Select the Requester's component")
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        "Enter the Business or Product Owner's name"
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText('Select a Business Owner Component')
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Enter the CMS Project/Product Manager or Lead name'
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Select a Project/Product Manager or Lead Component'
      )
    ).toBeInTheDocument();
  });
});
