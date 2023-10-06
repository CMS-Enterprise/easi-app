import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  getGovernanceTaskListQuery,
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'data/mock/systemIntake';
import useMessage, { MessageProvider } from 'hooks/useMessage';
import CreateSystemIntakeActionRequestEditsQuery from 'queries/CreateSystemIntakeActionRequestEditsQuery';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Actions from '.';

const MockMessage = () => {
  const { Message } = useMessage();
  return <Message />;
};

const renderActionPage = ({
  mocks,
  action
}: {
  mocks: MockedQuery[];
  action?: string;
}) => {
  return render(
    <VerboseMockedProvider mocks={mocks}>
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntake.id}/actions/${action}`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/actions/:subPage?`]}>
          <MessageProvider>
            <MockMessage />
            <Actions systemIntake={systemIntake} />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    </VerboseMockedProvider>
  );
};

describe('IT Gov Actions', () => {
  it('Renders options and selects action', async () => {
    render(
      <VerboseMockedProvider mocks={[getGovernanceTaskListQuery]}>
        <MemoryRouter
          initialEntries={[
            `/governance-review-team/${systemIntake.id}/actions`
          ]}
        >
          <Route path={[`/governance-review-team/:systemId/actions/:action?`]}>
            <MessageProvider>
              <Actions systemIntake={systemIntake} />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Request edits to a form' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Progress to a new step' })
    ).toBeInTheDocument();

    // Check that correct decision action renders for OPEN status with no decision
    expect(
      screen.getByRole('heading', {
        name: 'Issue a decision or close this request'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Issue a Life Cycle ID, mark this project as not approved, or close this request for another reason.'
      )
    ).toBeInTheDocument();
  });

  it('Renders request edits action', async () => {
    renderActionPage({
      action: 'request-edits',
      mocks: [
        getSystemIntakeQuery(),
        getSystemIntakeContactsQuery,
        getGovernanceTaskListQuery
      ]
    });

    expect(
      await screen.findByRole('heading', { name: 'Action: request edits' })
    ).toBeInTheDocument();

    // Requester is default recipient
    expect(
      screen.getByRole('checkbox', {
        name: `${requester.commonName}, ${requester.component} (Requester)`
      })
    ).toBeChecked();
  });

  it('Submits a request edits successfully', async () => {
    renderActionPage({
      action: 'request-edits',
      mocks: [
        getSystemIntakeQuery(),
        getSystemIntakeContactsQuery,
        getGovernanceTaskListQuery,
        {
          request: {
            query: CreateSystemIntakeActionRequestEditsQuery,
            variables: {
              input: {
                systemIntakeID: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                adminNote: '',
                additionalInfo: '',
                notificationRecipients: {
                  shouldNotifyITGovernance: true,
                  shouldNotifyITInvestment: false,
                  regularRecipientEmails: ['ally.anderson@local.fake']
                },
                intakeFormStep: 'INITIAL_REQUEST_FORM',
                emailFeedback: 'Ch-ch-changes'
              }
            }
          },
          result: {
            data: {
              createSystemIntakeActionRequestEdits: {
                systemIntake: {
                  id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                  __typename: 'SystemIntake'
                },
                __typename: 'UpdateSystemIntakePayload'
              }
            }
          }
        }
      ]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Fill in required fields

    userEvent.selectOptions(screen.getByTestId('intakeFormStep'), [
      'Initial request form'
    ]);

    userEvent.type(
      screen.getByLabelText(/What changes are needed?/),
      'Ch-ch-changes'
    );

    userEvent.click(screen.getByRole('button', { name: 'Complete action' }));

    expect(
      await screen.findByText(
        'Are you sure you want to complete this action to request edits?'
      )
    ).toBeInTheDocument();

    // Continue through confirmation
    userEvent.click(
      screen.getAllByRole('button', { name: 'Complete action' })[1]
    );

    // Success alert message
    await screen.findByText(
      'You have requested edits to the Initial request form.'
    );
  });

  it('Handles field errors for request edits', async () => {
    renderActionPage({
      action: 'request-edits',
      mocks: [
        getSystemIntakeQuery(),
        getSystemIntakeContactsQuery,
        getGovernanceTaskListQuery
      ]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    userEvent.click(screen.getByRole('button', { name: 'Complete action' }));

    await screen.findByText('Please check and fix the following');
    await screen.findByText('Which form needs edits?: Please make a selection');
    await screen.findByText(
      'What changes are needed?: Please fill in the blank'
    );
  });
});
