import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import i18next from 'i18next';

import { systemIntake } from 'data/mock/systemIntake';
import GetGovernanceRequestFeedbackQuery from 'queries/GetGovernanceRequestFeedbackQuery';
import {
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
} from 'queries/types/GetGovernanceRequestFeedback';
import { GovernanceRequestFeedback } from 'queries/types/GovernanceRequestFeedback';
import {
  GovernanceRequestFeedbackTargetForm,
  GovernanceRequestFeedbackType
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Feedback from '.';

const governanceRequestFeedbacks: GovernanceRequestFeedback[] = [
  {
    __typename: 'GovernanceRequestFeedback',
    id: 'd65b3327-0da0-4e77-af7c-d320abc417bd',
    feedback: 'This is feedback from the Request Edits action',
    targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
    type: GovernanceRequestFeedbackType.REQUESTER,
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    createdAt: '2023-11-14T16:00:04.047133Z'
  },
  {
    __typename: 'GovernanceRequestFeedback',
    id: 'beb9817b-1873-4f40-853a-7f1fbb1d6e12',
    feedback:
      'This is a recommendation for the GRB from the Progress to New Step action.',
    targetForm: GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED,
    type: GovernanceRequestFeedbackType.GRB,
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    createdAt: '2023-11-14T16:31:04.051502Z'
  },
  {
    __typename: 'GovernanceRequestFeedback',
    id: '02423c03-2334-4607-96f2-27be4c8e1538',
    feedback:
      'This is feedback for the requester from the Progress to New Step action.',
    targetForm: GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED,
    type: GovernanceRequestFeedbackType.REQUESTER,
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    createdAt: '2023-11-14T16:31:04.051502Z'
  }
];

const getGovernanceRequestFeedbackQuery: MockedQuery<
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
> = {
  request: {
    query: GetGovernanceRequestFeedbackQuery,
    variables: {
      intakeID: systemIntake.id
    }
  },
  result: {
    data: {
      systemIntake: {
        __typename: 'SystemIntake',
        governanceRequestFeedbacks
      }
    }
  }
};

describe('Feedback page', () => {
  it('Renders the feedback page', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/governance-task-list/${systemIntake.id}/feedback`]}
      >
        <VerboseMockedProvider mocks={[getGovernanceRequestFeedbackQuery]}>
          <Route path="/governance-task-list/:systemId/feedback">
            <Feedback />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', {
        name: i18next.t<string>('taskList:feedbackV2.heading')
      })
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', {
        name: i18next.t<string>(
          'taskList:navigation.returnToGovernanceTaskList'
        )
      })
    );

    expect(
      screen.getAllByRole('button', {
        name: i18next.t<string>('taskList:feedbackV2.downloadAsPDF')
      })
    );

    /** Array of feedback items */
    const feedbackItems = within(
      screen.getByTestId('feedback-list')
    ).getAllByRole('listitem');

    // Check correct number of feedback items are rendered
    expect(feedbackItems).toHaveLength(governanceRequestFeedbacks.length);

    const breadcrumbLinks = within(screen.getByRole('navigation')).getAllByRole(
      'listitem'
    );
    expect(breadcrumbLinks).toHaveLength(3);
  });
});
