import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetTrbTasklistQuery from 'gql/legacyGQL/GetTrbTasklistQuery';
import {
  GetTrbTasklist,
  GetTrbTasklistVariables
} from 'gql/legacyGQL/types/GetTrbTasklist';
import {
  UpdateTrbRequestArchived,
  UpdateTrbRequestArchivedVariables
} from 'gql/legacyGQL/types/UpdateTrbRequestArchived';
import UpdateTrbRequestArchivedQuery from 'gql/legacyGQL/UpdateTrbRequestArchivedQuery';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';
import {
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBGuidanceLetterStatusTaskList,
  TRBRequestType
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import { getByRoleWithNameTextKey } from 'utils/testing/helpers';
import MockMessage from 'utils/testing/MockMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TaskList from './TaskList';

const trbRequestId = 'a5fdb150-e1e5-41c1-93a4-bc5165aae66c';

const getTrbTasklistQuery: MockedQuery<
  GetTrbTasklist,
  GetTrbTasklistVariables
> = {
  request: {
    query: GetTrbTasklistQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      trbRequest: {
        name: 'Case 1 - Draft request form',
        type: TRBRequestType.NEED_HELP,
        form: {
          status: TRBFormStatus.READY_TO_START,
          __typename: 'TRBRequestForm'
        },
        taskStatuses: {
          formStatus: TRBFormStatus.READY_TO_START,
          feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
          consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
          attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
          guidanceLetterStatusTaskList:
            TRBGuidanceLetterStatusTaskList.CANNOT_START_YET,
          __typename: 'TRBTaskStatuses'
        },
        feedback: [],
        consultMeetingTime: null,
        relationType: null,
        contractName: null,
        contractNumbers: [],
        systems: [],
        __typename: 'TRBRequest'
      }
    }
  }
};

const updateTrbRequestArchived: MockedQuery<
  UpdateTrbRequestArchived,
  UpdateTrbRequestArchivedVariables
> = {
  request: {
    query: UpdateTrbRequestArchivedQuery,
    variables: {
      id: trbRequestId,
      archived: true
    }
  },
  result: {
    data: {
      updateTRBRequest: {
        id: trbRequestId,
        archived: true,
        __typename: 'TRBRequest'
      }
    }
  }
};

describe('Trb Task List', () => {
  it('renders', async () => {
    render(
      <MemoryRouter initialEntries={[`/trb/task-list/${trbRequestId}`]}>
        <VerboseMockedProvider mocks={[getTrbTasklistQuery]}>
          <MessageProvider>
            <Route path="/trb/task-list/:id">
              <TaskList />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Header
    screen.getByRole('heading', {
      level: 1,
      name: i18next.t<string>('technicalAssistance:taskList.heading')
    });

    // Crumb back to trb home
    expect(
      getByRoleWithNameTextKey('link', 'technicalAssistance:heading')
    ).toHaveAttribute('href', '/trb');

    // Sidebar back to home
    expect(
      getByRoleWithNameTextKey('link', 'technicalAssistance:button.saveAndExit')
    ).toHaveAttribute('href', '/trb');

    // First task list item
    screen.getByRole('heading', {
      level: 3,
      name: i18next.t<string>('technicalAssistance:taskList.taskList.0.heading')
    });
  });

  it('removes the request', async () => {
    render(
      <MemoryRouter initialEntries={[`/trb/task-list/${trbRequestId}`]}>
        <VerboseMockedProvider
          mocks={[getTrbTasklistQuery, updateTrbRequestArchived]}
        >
          <MessageProvider>
            <Route path="/trb/task-list/:id">
              <TaskList />
            </Route>
            <Route path="/">
              <MockMessage />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    const remove = getByRoleWithNameTextKey(
      'button',
      'technicalAssistance:button.removeYourRequest'
    );

    userEvent.click(remove);

    // Click through the confirmation modal

    const confirm = await screen.findByRole('button', {
      name: i18next.t<string>('taskList:withdraw_modal:confirm')
    });

    userEvent.click(confirm);

    await screen.findByText(
      i18next.t<string>('taskList:withdraw_modal:confirmationText', {
        context: 'name',
        requestName:
          (getTrbTasklistQuery.result as { data: GetTrbTasklist }).data
            .trbRequest.name ?? ''
      })
    );
  });
});
