import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import {
  getTRBRequestAttendeesQuery,
  getTrbRequestSummaryQuery,
  requester
} from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import CreateTrbAdminNote from 'queries/CreateTrbAdminNote';
import {
  CreateTrbAdminNote as CreateTrbAdminNoteType,
  CreateTrbAdminNoteVariables
} from 'queries/types/CreateTrbAdminNote';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';

import AddNote from './AddNote';
import TRBRequestInfoWrapper from './RequestContext';
import AdminHome from '.';

const createTrbAdminNoteQuery: MockedQuery<
  CreateTrbAdminNoteType,
  CreateTrbAdminNoteVariables
> = {
  request: {
    query: CreateTrbAdminNote,
    variables: {
      input: {
        trbRequestId: mockTrbRequestId,
        category: TRBAdminNoteCategory.GENERAL_REQUEST,
        noteText: 'Note text'
      }
    }
  },
  result: {
    data: {
      createTRBAdminNote: {
        __typename: 'TRBAdminNote',
        createdAt: '2023-02-16T15:21:34.156885Z',
        id: 'd35a1f08-e04e-48f9-8d58-7f2409bae8fe',
        isArchived: false,
        category: TRBAdminNoteCategory.GENERAL_REQUEST,
        noteText: 'Note text',
        author: {
          __typename: 'UserInfo',
          commonName: requester.userInfo.commonName
        }
      }
    }
  }
};

describe('Trb Admin Notes: Add Note', () => {
  Element.prototype.scrollIntoView = vi.fn();

  const store = easiMockStore();

  it('submits successfully ', async () => {
    await act(async () => {
      const { getByText, getByLabelText, getByRole } = render(
        <Provider store={store}>
          <MockedProvider
            defaultOptions={{
              watchQuery: { fetchPolicy: 'no-cache' },
              query: { fetchPolicy: 'no-cache' }
            }}
            mocks={[
              createTrbAdminNoteQuery,
              getTrbRequestSummaryQuery,
              getTRBRequestAttendeesQuery
            ]}
          >
            <MemoryRouter
              initialEntries={[`/trb/${mockTrbRequestId}/notes/add-note`]}
            >
              <TRBRequestInfoWrapper>
                <MessageProvider>
                  <Route exact path="/trb/:id/:activePage">
                    <AdminHome />
                  </Route>

                  <Route exact path="/trb/:id/notes/add-note">
                    <AddNote />
                  </Route>
                </MessageProvider>
              </TRBRequestInfoWrapper>
            </MemoryRouter>
          </MockedProvider>
        </Provider>
      );

      getByText(
        i18next.t<string>('technicalAssistance:notes.addNoteDescription')
      );

      const submitButton = getByRole('button', {
        name: i18next.t<string>('technicalAssistance:notes.saveNote')
      });

      expect(submitButton).toBeDisabled();

      // Select note category
      userEvent.selectOptions(
        getByLabelText(
          RegExp(i18next.t<string>('technicalAssistance:notes.labels.category'))
        ),
        ['Supporting documents']
      );

      // Enter note text
      userEvent.type(
        getByLabelText(
          RegExp(i18next.t<string>('technicalAssistance:notes.labels.noteText'))
        ),
        'My cute note'
      );

      userEvent.click(submitButton);
    });
  });

  it('shows an error notice when submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <MockedProvider
        mocks={[
          {
            ...createTrbAdminNoteQuery,
            error: new Error()
          }
        ]}
      >
        <MemoryRouter
          initialEntries={[`/trb/${mockTrbRequestId}/notes/add-note`]}
        >
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/notes/add-note">
                <AddNote />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </MockedProvider>
    );

    // Select note category
    userEvent.selectOptions(
      getByLabelText(
        RegExp(i18next.t<string>('technicalAssistance:notes.labels.category'))
      ),
      ['Supporting documents']
    );

    // Enter note text
    userEvent.type(
      getByLabelText(
        RegExp(i18next.t<string>('technicalAssistance:notes.labels.noteText'))
      ),
      'My cute note'
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:notes.saveNote')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:notes.status.error')
    );
  });
});
