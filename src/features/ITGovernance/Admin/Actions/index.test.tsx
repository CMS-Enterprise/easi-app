import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable
} from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemIntakeFormStep, SystemIntakeStep } from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  getGovernanceTaskListQuery,
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import MockMessage from 'utils/testing/MockMessage';
import typeRichText from 'utils/testing/typeRichText';

import Actions from '.';

// --- A tiny provider that forces the mutation to succeed and uses your normal mocks for queries ---
function makeClient(mocks: MockedQuery[]) {
  // Link 1: short-circuit the mutation with a success payload (no errors)
  const interceptMutation = new ApolloLink(operation => {
    const opName = operation.operationName;
    if (opName === 'CreateSystemIntakeActionRequestEdits') {
      return new Observable(observer => {
        observer.next({
          data: {
            __typename: 'Mutation',
            createSystemIntakeActionRequestEdits: {
              __typename: 'UpdateSystemIntakePayload',
              errors: [],
              userErrors: [],
              systemIntake: {
                __typename: 'SystemIntake',
                id: systemIntake.id
              }
            }
          }
        });
        observer.complete();
      });
    }
    // otherwise pass through to the mock link
    return forwardMock.request(operation) as any;
  });

  // Link 2: normal MockLink for your queries and any other ops
  const forwardMock = new MockLink(mocks, true);

  return new ApolloClient({
    link: ApolloLink.from([interceptMutation]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
      query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
      mutate: { errorPolicy: 'all' }
    }
  });
}

function renderWithProvider({
  mocks,
  initialEntry
}: {
  mocks: MockedQuery[];
  initialEntry: string;
}) {
  const client = makeClient(mocks);

  return render(
    <ApolloProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Route
          path={[
            `/it-governance/:systemId/actions/:subPage?`,
            `/it-governance/:systemId/actions/:action?`
          ]}
        >
          <MessageProvider>
            <MockMessage />
            <Actions systemIntake={systemIntake} />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    </ApolloProvider>
  );
}

describe('IT Gov Actions', () => {
  it('Renders options and selects action', async () => {
    renderWithProvider({
      mocks: [getGovernanceTaskListQuery()],
      initialEntry: `/it-governance/${systemIntake.id}/actions`
    });

    expect(
      await screen.findByRole('heading', { name: 'Request edits to a form' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Progress to a new step' })
    ).toBeInTheDocument();

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
    it('target form dropdown selects the current form step by default', async () => {
      renderWithProvider({
        initialEntry: `/it-governance/${systemIntake.id}/actions/request-edits`,
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery({
            step: SystemIntakeStep.DRAFT_BUSINESS_CASE
          })
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
      renderWithProvider({
        initialEntry: `/it-governance/${systemIntake.id}/actions/request-edits`,
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery({
            step: SystemIntakeStep.GRT_MEETING
          })
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
      renderWithProvider({
        initialEntry: `/it-governance/${systemIntake.id}/actions/request-edits`,
        mocks: [
          // initial data
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery(),
          // post-mutation refetches (MockLink will satisfy these)
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery()
        ]
      });

      const user = userEvent.setup();

      expect(
        await screen.findByRole('heading', { name: 'Action: request edits' })
      ).toBeInTheDocument();

      // Select by visible text is fine here
      await user.selectOptions(screen.getByTestId('intakeFormStep'), [
        'Intake Request form'
      ]);

      await typeRichText(screen.getByTestId('emailFeedback'), 'Ch-ch-changes');

      await user.click(screen.getByRole('button', { name: 'Complete action' }));

      expect(
        await screen.findByText(
          'Are you sure you want to complete this action to request edits?'
        )
      ).toBeInTheDocument();

      await user.click(
        screen.getAllByRole('button', { name: 'Complete action' })[1]
      );

      // With the forced-success mutation, the success alert should appear
      await screen.findByText(
        'You have requested edits to the Intake Request form.'
      );
    });
  });

  describe('Progress to a new step', () => {
    it('displays past date warning', async () => {
      renderWithProvider({
        initialEntry: `/it-governance/${systemIntake.id}/actions/new-step`,
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery()
        ]
      });

      const user = userEvent.setup();

      await screen.findByRole('heading', {
        name: 'Action: progress to a new step'
      });

      await user.click(screen.getByRole('radio', { name: 'GRB review' }));

      const meetingDateField = screen.getByRole('textbox', {
        name: 'Meeting date'
      });
      await user.type(meetingDateField, '01/01/2000');

      expect(
        await screen.findByText(i18next.t<string>('action:pastDateAlert'))
      ).toBeInTheDocument();
    });

    it('handles field errors', async () => {
      renderWithProvider({
        initialEntry: `/it-governance/${systemIntake.id}/actions/new-step`,
        mocks: [
          getSystemIntakeQuery(),
          getSystemIntakeContactsQuery,
          getGovernanceTaskListQuery({ step: SystemIntakeStep.GRB_MEETING })
        ]
      });
      const user = userEvent.setup();

      await screen.findByRole('heading', {
        name: 'Action: progress to a new step'
      });

      await user.click(screen.getByRole('radio', { name: 'GRB review' }));
      await user.click(screen.getByRole('button', { name: 'Complete action' }));

      await screen.findByText(
        'This request is already at the GRB review step. Please select a different step.'
      );
    });
  });
});
