import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSystemIntakeActionRequestEditsQuery from 'gql/legacyGQL/CreateSystemIntakeActionRequestEditsQuery';
import {
  CreateSystemIntakeActionRequestEdits,
  CreateSystemIntakeActionRequestEditsVariables
} from 'gql/legacyGQL/types/CreateSystemIntakeActionRequestEdits';
import i18next from 'i18next';
import {
  getGovernanceTaskListQuery,
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import {
  SystemIntakeFormStep,
  SystemIntakeStep
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import MockMessage from 'utils/testing/MockMessage';
import typeRichText from 'utils/testing/typeRichText';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Actions from '.';

const renderActionPage = ({
  mocks,
  action
}: {
  mocks: MockedQuery[];
  action?: string;
}) => {
  return render(
    <VerboseMockedProvider mocks={mocks} addTypename>
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/actions/${action}`]}
      >
        <Route path={[`/it-governance/:systemId/actions/:subPage?`]}>
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
      <VerboseMockedProvider mocks={[getGovernanceTaskListQuery()]}>
        <MemoryRouter
          initialEntries={[`/it-governance/${systemIntake.id}/actions`]}
        >
          <Route path={[`/it-governance/:systemId/actions/:action?`]}>
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

  describe('Request edits', () => {
    const createSystemIntakeActionRequestEditsQuery: MockedQuery<
      CreateSystemIntakeActionRequestEdits,
      CreateSystemIntakeActionRequestEditsVariables
    > = {
      request: {
        query: CreateSystemIntakeActionRequestEditsQuery,
        variables: {
          input: {
            systemIntakeID: systemIntake.id,
            adminNote: null,
            additionalInfo: '',
            notificationRecipients: {
              shouldNotifyITGovernance: true,
              shouldNotifyITInvestment: false,
              regularRecipientEmails: [requester.email!]
            },
            intakeFormStep: SystemIntakeFormStep.INITIAL_REQUEST_FORM,
            emailFeedback: '<p>Ch-ch-changes</p>'
          }
        }
      },
      result: {
        data: {
          createSystemIntakeActionRequestEdits: {
            systemIntake: {
              id: systemIntake.id,
              __typename: 'SystemIntake'
            },
            __typename: 'UpdateSystemIntakePayload'
          }
        }
      }
    };

    it('target form dropdown selects the current form step by default', async () => {
      renderActionPage({
        action: 'request-edits',
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery({
            step: SystemIntakeStep.DRAFT_BUSINESS_CASE
          }),
          createSystemIntakeActionRequestEditsQuery
        ]
      });

      expect(
        await screen.findByRole('heading', { name: 'Action: request edits' })
      ).toBeInTheDocument();

      const dropdown = await screen.findByTestId('intakeFormStep');

      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveValue(SystemIntakeFormStep.DRAFT_BUSINESS_CASE);
    });

    it('target form dropdown has no selection when in a non-form step', async () => {
      renderActionPage({
        action: 'request-edits',
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery({
            step: SystemIntakeStep.GRT_MEETING
          }),
          createSystemIntakeActionRequestEditsQuery
        ]
      });

      expect(
        await screen.findByRole('heading', { name: 'Action: request edits' })
      ).toBeInTheDocument();

      const dropdown = await screen.findByTestId('intakeFormStep');
      expect(dropdown).toBeInTheDocument();
      const selectedOption = dropdown.querySelector('option[selected]');
      expect(selectedOption).not.toBeInTheDocument();
    });

    it('submits the form successfully', async () => {
      renderActionPage({
        action: 'request-edits',
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery(),
          getGovernanceTaskListQuery(),
          createSystemIntakeActionRequestEditsQuery
        ]
      });

      expect(
        await screen.findByRole('heading', { name: 'Action: request edits' })
      ).toBeInTheDocument();

      // Fill in required fields

      userEvent.selectOptions(screen.getByTestId('intakeFormStep'), [
        'Intake Request form'
      ]);

      await typeRichText(screen.getByTestId('emailFeedback'), 'Ch-ch-changes');

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
        'You have requested edits to the Intake Request form.'
      );
    });
  });

  describe('Progress to a new step', () => {
    it('displays past date warning', async () => {
      renderActionPage({
        action: 'new-step',
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery()
        ]
      });

      await screen.findByRole('heading', {
        name: 'Action: progress to a new step'
      });

      userEvent.click(screen.getByRole('radio', { name: 'GRB meeting' }));

      const meetingDateField = screen.getByRole('textbox', {
        name: 'Meeting date'
      });
      userEvent.type(meetingDateField, '01/01/2000');

      expect(
        await screen.findByText(i18next.t<string>('action:pastDateAlert'))
      ).toBeInTheDocument();
    });

    it('handles field errors', async () => {
      renderActionPage({
        action: 'new-step',
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery({ step: SystemIntakeStep.GRB_MEETING })
        ]
      });

      await screen.findByRole('heading', {
        name: 'Action: progress to a new step'
      });

      userEvent.click(screen.getByRole('radio', { name: 'GRB meeting' }));
      userEvent.click(screen.getByRole('button', { name: 'Complete action' }));

      // Error for selecting current step
      await screen.findByText(
        'This request is already at the GRB meeting step. Please select a different step.'
      );
    });
  });
});
