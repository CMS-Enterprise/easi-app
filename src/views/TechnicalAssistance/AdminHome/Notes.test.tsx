import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import {
  getTrbAdminNotesQuery,
  getTRBRequestAttendeesQuery,
  getTrbRequestSummaryQuery
} from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import { TRBAdminNoteFragment } from 'queries/types/TRBAdminNoteFragment';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Notes from './Notes';
import TRBRequestInfoWrapper from './RequestContext';

const adminNotes: TRBAdminNoteFragment[] = [
  {
    __typename: 'TRBAdminNote',
    id: '727cd90e-216f-4037-9160-b674f0a97eb5',
    isArchived: false,
    category: TRBAdminNoteCategory.INITIAL_REQUEST_FORM,
    noteText: 'Initial Request Form Note',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteInitialRequestFormCategoryData',
      appliesToBasicRequestDetails: true,
      appliesToSubjectAreas: true,
      appliesToAttendees: false
    },
    createdAt: '2024-03-28T13:20:37.852099Z'
  },
  {
    __typename: 'TRBAdminNote',
    id: '40970bd6-2984-475f-a879-a05ed0517843',
    isArchived: false,
    category: TRBAdminNoteCategory.SUPPORTING_DOCUMENTS,
    noteText: 'Supporting Documents Note',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteSupportingDocumentsCategoryData',
      documents: [
        {
          __typename: 'TRBRequestDocument',
          fileName: 'documentOne.pdf',
          deletedAt: null
        },
        {
          __typename: 'TRBRequestDocument',
          fileName: 'documentTwo.pdf',
          deletedAt: null
        }
      ]
    },
    createdAt: '2024-03-27T13:20:37.852099Z'
  },
  {
    __typename: 'TRBAdminNote',
    id: 'badd3c6c-86f2-40fd-af1b-4ab46c4f8c34',
    isArchived: false,
    category: TRBAdminNoteCategory.ADVICE_LETTER,
    noteText: 'Advice Letter Note',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteAdviceLetterCategoryData',
      appliesToMeetingSummary: true,
      appliesToNextSteps: false,
      recommendations: [
        {
          __typename: 'TRBAdviceLetterRecommendation',
          title: 'Recommendation One',
          deletedAt: null
        },
        {
          __typename: 'TRBAdviceLetterRecommendation',
          title: 'Recommendation Two',
          deletedAt: null
        }
      ]
    },
    createdAt: '2024-03-26T13:20:37.852099Z'
  },
  {
    __typename: 'TRBAdminNote',
    id: 'e067cfb6-59ab-44f4-893e-8f63e54ef081',
    isArchived: false,
    category: TRBAdminNoteCategory.GENERAL_REQUEST,
    noteText: 'General Request Note',
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
    noteText: 'General Request Note',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteGeneralRequestCategoryData'
    },
    createdAt: '2024-03-24T13:20:37.852099Z'
  },
  {
    __typename: 'TRBAdminNote',
    id: 'dc1ea2b1-3868-4a11-b1ba-dd326fefa0b7',
    isArchived: false,
    category: TRBAdminNoteCategory.GENERAL_REQUEST,
    noteText: 'Hidden note',
    author: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld'
    },
    categorySpecificData: {
      __typename: 'TRBAdminNoteGeneralRequestCategoryData'
    },
    createdAt: '2024-03-23T13:20:37.852099Z'
  }
];

const getTrbAdminNotes = getTrbAdminNotesQuery(adminNotes);

describe('Trb Admin Notes: View Notes', () => {
  Element.prototype.scrollIntoView = vi.fn();

  const store = easiMockStore();

  it('renders successfully ', async () => {
    const { asFragment } = render(
      <Provider store={store}>
        <VerboseMockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            getTrbAdminNotes,
            getTrbRequestSummaryQuery,
            getTRBRequestAttendeesQuery
          ]}
        >
          <MemoryRouter initialEntries={[`/trb/${mockTrbRequestId}/notes`]}>
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <Notes trbRequestId={mockTrbRequestId} />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    screen.getByText(
      i18next.t<string>('technicalAssistance:notes.description')
    );

    const notes = await screen.findAllByTestId('trb-note');

    // Only 5 notes should render before "view more notes" button
    expect(notes.length).toEqual(5);

    const renderedNote = within(notes[0]);
    const noteData = adminNotes[0];

    // Note component successfully passed query data and rendered
    expect(
      renderedNote.getByText(
        formatDateLocal(noteData.createdAt, 'MMMM d, yyyy')
      )
    ).toBeInTheDocument();

    expect(
      renderedNote.getByText(noteData.author.commonName)
    ).toBeInTheDocument();

    expect(renderedNote.getByText(noteData.noteText)).toBeInTheDocument();

    const hiddenNote = screen.queryByText(adminNotes[5].noteText);
    expect(hiddenNote).not.toBeInTheDocument();

    const moreNotes = await screen.findByRole('button', {
      name: i18next.t<string>(
        i18next.t<string>('technicalAssistance:notes.viewMore')
      )
    });

    userEvent.click(moreNotes);
    expect(moreNotes).not.toBeInTheDocument();

    const hiddenNote2 = screen.queryByText(adminNotes[5].noteText);
    expect(hiddenNote2).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
