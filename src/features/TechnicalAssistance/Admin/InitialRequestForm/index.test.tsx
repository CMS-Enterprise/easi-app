import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ModalRef } from '@trussworks/react-uswds';
import i18next from 'i18next';
import {
  getTrbAdminNotesQuery,
  getTRBRequestAttendeesQuery,
  getTrbRequestDocumentsQuery,
  getTrbRequestQuery,
  getTrbRequestSummaryQuery,
  trbRequestSummary
} from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TRBRequestInfoWrapper from '../_components/RequestContext';

import InitialRequestForm from '.';

describe('Trb Admin Initial Request Form', () => {
  it('renders', async () => {
    const store = easiMockStore();

    const modalRef = React.createRef<ModalRef>();
    const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

    const { getByText, queryByText, queryAllByText, findByText } = render(
      <VerboseMockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          getTrbRequestQuery,
          getTrbRequestSummaryQuery,
          getTRBRequestAttendeesQuery,
          getTrbRequestDocumentsQuery,
          getTrbAdminNotesQuery()
        ]}
      >
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[`/trb/${mockTrbRequestId}/initial-request-form`]}
          >
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <InitialRequestForm
                    trbRequestId={trbRequestSummary.id}
                    trbRequest={trbRequestSummary}
                    assignLeadModalRef={modalRef}
                    assignLeadModalTrbRequestIdRef={trbRequestIdRef}
                  />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </Provider>
      </VerboseMockedProvider>
    );

    // Loaded okay
    await findByText(
      i18next.t<string>('technicalAssistance:adminHome.initialRequestForm')
    );

    // Task status tag rendered from query data
    await findByText(i18next.t<string>('taskList:taskStatus.IN_PROGRESS'));

    // Admin description text of request form steps, up to Documents
    for (let stepIdx = 0; stepIdx <= 3; stepIdx += 1) {
      getByText(
        i18next.t<string>(
          `technicalAssistance:requestForm.steps.${stepIdx}.adminDescription`
        )
      );
    }

    // Shouldn't show edit section option
    expect(
      queryAllByText(i18next.t<string>('technicalAssistance:check.edit'))
    ).toHaveLength(0);

    // Shouldn't show request header info
    expect(
      queryByText(
        i18next.t<string>('technicalAssistance:table.header.submissionDate')
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(i18next.t<string>('technicalAssistance:check.requestType'))
    ).not.toBeInTheDocument();

    // Empty documents table loaded
    await findByText(
      i18next.t<string>('technicalAssistance:documents.table.noDocuments')
    );
  });
});
