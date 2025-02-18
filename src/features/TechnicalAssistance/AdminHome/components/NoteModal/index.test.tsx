import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  CreateTRBAdminNoteGeneralRequestDocument,
  CreateTRBAdminNoteGeneralRequestMutation,
  CreateTRBAdminNoteGeneralRequestMutationVariables,
  TRBAdminNoteCategory,
  TRBAdminNoteFragment
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { getTrbAdminNotesQuery } from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';

import NotesModal from '.';

const adminNotes: TRBAdminNoteFragment[] = [
  {
    __typename: 'TRBAdminNote',
    id: 'e067cfb6-59ab-44f4-893e-8f63e54ef081',
    isArchived: false,
    category: TRBAdminNoteCategory.GENERAL_REQUEST,
    noteText: 'General request note text 1',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteGeneralRequestCategoryData'
    },
    createdAt: '2024-03-25T13:20:37.852099Z'
  },
  {
    __typename: 'TRBAdminNote',
    id: 'da4c4734-4414-4cd0-bd3d-da7b5554df0e',
    isArchived: false,
    category: TRBAdminNoteCategory.GENERAL_REQUEST,
    noteText: 'General request note text 2',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteGeneralRequestCategoryData'
    },
    createdAt: '2024-03-24T13:20:37.852099Z'
  }
];

const createAdminNoteQuery: MockedQuery<
  CreateTRBAdminNoteGeneralRequestMutation,
  CreateTRBAdminNoteGeneralRequestMutationVariables
> = {
  request: {
    query: CreateTRBAdminNoteGeneralRequestDocument,
    variables: {
      input: {
        trbRequestId: mockTrbRequestId,
        noteText: adminNotes[1].noteText
      }
    }
  },
  result: {
    data: {
      __typename: 'Mutation',
      createTRBAdminNoteGeneralRequest: adminNotes[1]
    }
  }
};

describe('Trb Admin Notes: Modal Component', () => {
  Element.prototype.scrollIntoView = vi.fn();

  const store = easiMockStore();

  it('renders Notes successfully on modal open', async () => {
    Element.prototype.scrollIntoView = vi.fn();

    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    const { findByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/trb/${mockTrbRequestId}/request`]}>
          <MockedProvider
            defaultOptions={{
              watchQuery: { fetchPolicy: 'no-cache' },
              query: { fetchPolicy: 'no-cache' }
            }}
            mocks={[
              getTrbAdminNotesQuery([adminNotes[0]]),
              createAdminNoteQuery
            ]}
          >
            <MessageProvider>
              <Route path="/trb/:id/:activePage?">
                <NotesModal
                  isOpen
                  trbRequestId={mockTrbRequestId}
                  openModal={() => null}
                  addNote={false}
                />
              </Route>
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    // Notes component successfully rendered from modal
    const submissionDate = await findByText(adminNotes[0].noteText);
    expect(submissionDate).toBeInTheDocument();
  });

  it('renders AddNote successfully on modal open', async () => {
    Element.prototype.scrollIntoView = vi.fn();

    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/trb/${mockTrbRequestId}/request`]}>
          <MockedProvider
            defaultOptions={{
              watchQuery: { fetchPolicy: 'no-cache' },
              query: { fetchPolicy: 'no-cache' }
            }}
            mocks={[createAdminNoteQuery]}
          >
            <MessageProvider>
              <Route path="/trb/:id/:activePage?">
                <NotesModal
                  isOpen
                  trbRequestId={mockTrbRequestId}
                  openModal={() => null}
                  addNote
                />
              </Route>
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    // AddNote component successfully rendered from modal
    getByText(
      i18next.t<string>('technicalAssistance:notes.addNoteDescription')
    );
  });
});
