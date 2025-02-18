import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalRef } from '@trussworks/react-uswds';
import GetTrbRequestConsultMeetingQuery from 'gql/legacyGQL/GetTrbRequestConsultMeetingQuery';
import {
  GetTrbRequestSummary,
  GetTrbRequestSummaryVariables
} from 'gql/legacyGQL/types/GetTrbRequestSummary';
import i18next from 'i18next';

import {
  getTrbAdminNotesQuery,
  getTRBRequestAttendeesQuery,
  getTrbRequestDocumentsQuery,
  getTrbRequestQuery,
  getTrbRequestSummary,
  getTrbRequestSummaryQuery,
  trbRequestSummary,
  updateTrbRequestConsultMeetingQuery
} from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import { TRBFeedbackStatus } from 'types/graphql-global-types';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Consult from './Consult';
import InitialRequestForm from './InitialRequestForm';
import TRBRequestInfoWrapper from './RequestContext';

const summaryQuery: MockedQuery<
  GetTrbRequestSummary,
  GetTrbRequestSummaryVariables
> = {
  ...getTrbRequestSummaryQuery,
  result: {
    data: {
      trbRequest: getTrbRequestSummary({
        taskStatuses: {
          feedbackStatus: TRBFeedbackStatus.COMPLETED
        }
      })
    }
  }
};

describe('Trb Admin: Action: Schedule a TRB consult session', () => {
  Element.prototype.scrollIntoView = vi.fn();

  const store = easiMockStore({ groups: ['EASI_TRB_ADMIN_D'] });

  const modalRef = React.createRef<ModalRef>();
  const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

  const emptyConsultMeetingTime = {
    request: {
      query: GetTrbRequestConsultMeetingQuery,
      variables: {
        id: mockTrbRequestId
      }
    },
    result: {
      data: {
        trbRequest: {
          id: mockTrbRequestId,
          consultMeetingTime: null,
          __typename: 'TRBRequest'
        }
      }
    }
  };

  it('submits successfully ', async () => {
    const { findByText, getByLabelText, getByRole, findByRole } = render(
      <Provider store={store}>
        <VerboseMockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            updateTrbRequestConsultMeetingQuery,
            getTrbRequestQuery,
            getTRBRequestAttendeesQuery,
            getTRBRequestAttendeesQuery,
            getTrbAdminNotesQuery(),
            summaryQuery,
            summaryQuery,
            emptyConsultMeetingTime,
            getTrbRequestDocumentsQuery
          ]}
        >
          <MemoryRouter
            initialEntries={[
              `/trb/${mockTrbRequestId}/initial-request-form/schedule-consult`
            ]}
          >
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <InitialRequestForm
                    trbRequest={trbRequestSummary}
                    trbRequestId={mockTrbRequestId}
                    assignLeadModalRef={modalRef}
                    assignLeadModalTrbRequestIdRef={trbRequestIdRef}
                  />
                </Route>
                <Route exact path="/trb/:id/:activePage/:action">
                  <Consult />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionScheduleConsult.heading')
    );

    await findByText('Choose recipients');

    const submitButton = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
    });

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingDate'
          )
        )
      ),
      '02/23/2023'
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingTime'
          )
        )
      ),
      '1:00pm{enter}'
    );

    userEvent.click(submitButton);

    // This test will check that the meetingDate and meetingTime field inputs
    // are properly parsed to utc iso for the query
    // Note: the jest timezone is set to utc in `jest-global-setup.js`

    await findByRole('heading', { name: /Initial request form/ });

    // await findByText(
    //   i18next.t<string>('technicalAssistance:actionScheduleConsult.success', {
    //     date: '02/23/2023',
    //     time: '1:00 pm',
    //     interpolation: {
    //       escapeValue: false
    //     }
    //   })
    // );
  });

  it('shows the error summary on missing required fields', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <VerboseMockedProvider
        mocks={[
          summaryQuery,
          getTRBRequestAttendeesQuery,
          getTRBRequestAttendeesQuery,
          emptyConsultMeetingTime
        ]}
      >
        <MemoryRouter
          initialEntries={[
            `/trb/${mockTrbRequestId}/initial-request-form/schedule-consult`
          ]}
        >
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage/:action">
                <Consult />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.notes'
          )
        )
      ),
      'note'
    );

    // Submit the required date and time missing

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
      })
    );

    await findByText(i18next.t<string>('technicalAssistance:errors.checkFix'));

    // Check that error alert buttons appear for the missing fields

    getByRole('button', {
      name: RegExp(
        i18next.t<string>(
          'technicalAssistance:actionScheduleConsult.labels.meetingDate'
        )
      )
    });

    getByRole('button', {
      name: RegExp(
        i18next.t<string>(
          'technicalAssistance:actionScheduleConsult.labels.meetingTime'
        )
      )
    });
  });

  it('shows an error notice when submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <VerboseMockedProvider
        mocks={[
          getTRBRequestAttendeesQuery,
          summaryQuery,
          {
            ...updateTrbRequestConsultMeetingQuery,
            error: new Error()
          },
          emptyConsultMeetingTime
        ]}
      >
        <MemoryRouter
          initialEntries={[
            `/trb/${mockTrbRequestId}/initial-request-form/schedule-consult`
          ]}
        >
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage/:action">
                <Consult />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingDate'
          )
        )
      ),
      '02/23/2023'
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingTime'
          )
        )
      ),
      '1:00pm{enter}'
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionScheduleConsult.error')
    );
  });
});
