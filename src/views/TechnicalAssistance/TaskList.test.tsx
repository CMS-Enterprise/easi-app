import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';
import GetTrbTasklistQuery from 'queries/GetTrbTasklistQuery';
import { getByRoleWithNameTextKey } from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TaskList from './TaskList';

describe('Trb Task List', () => {
  it('renders', async () => {
    const trbRequestId = 'a5fdb150-e1e5-41c1-93a4-bc5165aae66c';

    render(
      <MemoryRouter initialEntries={[`/trb/task-list/${trbRequestId}`]}>
        <VerboseMockedProvider
          mocks={[
            {
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
                    type: 'NEED_HELP',
                    form: {
                      status: 'READY_TO_START',
                      __typename: 'TRBRequestForm'
                    },
                    taskStatuses: {
                      formStatus: 'READY_TO_START',
                      feedbackStatus: 'CANNOT_START_YET',
                      consultPrepStatus: 'CANNOT_START_YET',
                      attendConsultStatus: 'CANNOT_START_YET',
                      adviceLetterStatusTaskList: 'CANNOT_START_YET',
                      __typename: 'TRBTaskStatuses'
                    },
                    feedback: [],
                    consultMeetingTime: null,
                    __typename: 'TRBRequest'
                  }
                }
              }
            }
          ]}
        >
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
});
