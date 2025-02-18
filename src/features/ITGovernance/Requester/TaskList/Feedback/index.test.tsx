import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import GetGovernanceRequestFeedbackQuery from 'gql/legacyGQL/GetGovernanceRequestFeedbackQuery';
import {
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
} from 'gql/legacyGQL/types/GetGovernanceRequestFeedback';
import { GovernanceRequestFeedback } from 'gql/legacyGQL/types/GovernanceRequestFeedback';
import i18next from 'i18next';

import { systemIntake } from 'data/mock/systemIntake';
import {
  GovernanceRequestFeedbackTargetForm,
  GovernanceRequestFeedbackType
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import { formatDateLocal } from 'utils/date';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import FeedbackItem from './FeedbackItem';
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
    createdAt: '2023-11-14T17:00:04.047133Z'
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
        id: systemIntake.id,
        requestName: 'System Intake Request',
        governanceRequestFeedbacks
      }
    }
  }
};

describe('Feedback page', () => {
  it('Renders the feedback page - Governance task list', async () => {
    const { asFragment } = render(
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
      screen.getByRole('heading', {
        name: i18next.t<string>('taskList:feedbackV2.heading')
      })
    ).toBeInTheDocument();

    expect(
      await screen.findAllByRole('link', {
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

    // Breadcrumbs
    const breadcrumbLinks = within(screen.getByRole('navigation')).getAllByRole(
      'listitem'
    );
    expect(breadcrumbLinks).toHaveLength(3);

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders the feedback page - Intake Request Form', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/governance-task-list/${systemIntake.id}/feedback`,
            // Set state for when navigating to feedback from Intake Request form
            state: {
              form: {
                pathname: `/system/${systemIntake.id}/contact-details`,
                type: 'Intake Request Form'
              }
            }
          }
        ]}
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
        name: i18next.t<string>('taskList:navigation.returnToForm', {
          type: 'Intake Request Form'
        })
      })
    );

    // Breadcrumbs
    const breadcrumbLinks = within(screen.getByRole('navigation')).getAllByRole(
      'listitem'
    );
    expect(breadcrumbLinks).toHaveLength(4);

    // Check for Intake Request form breadcrumb link
    expect(
      within(breadcrumbLinks[2]).getByText(
        i18next.t<string>('Intake Request Form')
      )
    );
  });
});

describe('Feedback item component', () => {
  const [editsRequestedFeedback, grbFeedback, requesterFeedback] =
    governanceRequestFeedbacks;

  it('Renders feedback type - Edits requested', () => {
    render(<FeedbackItem {...editsRequestedFeedback} />);

    const { createdAt, author, targetForm, feedback } =
      governanceRequestFeedbacks[0];

    expect(
      screen.getByRole('heading', {
        name: i18next.t<string>(
          'taskList:feedbackV2.feedbackTitleEditsRequested'
        )
      })
    );

    const formattedDate = formatDateLocal(createdAt, 'MMMM d, yyyy');
    expect(screen.getByText(formattedDate));

    const formattedAuthor = i18next.t<string>('taskList:feedbackV2.author', {
      name: author?.commonName
    });
    expect(screen.getByText(formattedAuthor));

    const targetFormList = screen.getByTestId('target-form');
    expect(
      within(targetFormList).getByText(
        i18next.t<string>(`taskList:feedbackV2.targetForm.${targetForm}`)
      )
    );

    expect(screen.getByText(feedback));
  });

  it('Renders feedback type - Requester', () => {
    render(<FeedbackItem {...requesterFeedback} />);

    expect(
      screen.getByRole('heading', {
        name: 'General feedback for the requester'
      })
    );

    // Target form text should be hidden for NO_TARGET_PROVIDED
    expect(screen.queryByTestId('target-form')).toBeNull();
  });

  it('Renders feedback type - GRB', () => {
    render(<FeedbackItem {...grbFeedback} />);

    expect(
      screen.getByRole('heading', {
        name: 'Recommendation for the Governance Review Board (GRB)'
      })
    );

    // Target form text should be hidden for NO_TARGET_PROVIDED
    expect(screen.queryByTestId('target-form')).toBeNull();
  });
});
