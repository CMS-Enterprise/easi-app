import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import selectEvent from 'react-select-event';
import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import {
  adviceLetter,
  getTRBRequestAttendeesQuery,
  getTrbRequestSummaryQuery,
  requester
} from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import { CreateTrbAdminNoteGeneralRequestQuery } from 'queries/TrbAdminNoteQueries';
import { GetTrbRecommendationsQuery } from 'queries/TrbAdviceLetterQueries';
import {
  CreateTRBAdminNoteGeneralRequest,
  CreateTRBAdminNoteGeneralRequestVariables
} from 'queries/types/CreateTRBAdminNoteGeneralRequest';
import {
  GetTrbRecommendations,
  GetTrbRecommendationsVariables
} from 'queries/types/GetTrbRecommendations';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'queries/types/GetTrbRequestDocuments';
import {
  TRBAdminNoteCategory,
  TRBDocumentCommonType,
  TRBRequestDocumentStatus
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';
import typeRichText from 'utils/testing/typeRichText';

import TRBRequestInfoWrapper from '../RequestContext';
import AdminHome from '..';

import AddNote from '.';

const { recommendations } = adviceLetter;

const getTrbRecommendationsQuery: MockedQuery<
  GetTrbRecommendations,
  GetTrbRecommendationsVariables
> = {
  request: {
    query: GetTrbRecommendationsQuery,
    variables: {
      id: mockTrbRequestId
    }
  },
  result: {
    data: {
      trbRequest: {
        __typename: 'TRBRequest',
        adviceLetter: {
          __typename: 'TRBGuidanceLetter',
          recommendations
        }
      }
    }
  }
};

const createTrbAdminNoteQuery: MockedQuery<
  CreateTRBAdminNoteGeneralRequest,
  CreateTRBAdminNoteGeneralRequestVariables
> = {
  request: {
    query: CreateTrbAdminNoteGeneralRequestQuery,
    variables: {
      input: {
        trbRequestId: mockTrbRequestId,
        noteText: 'Note text'
      }
    }
  },
  result: {
    data: {
      createTRBAdminNoteGeneralRequest: {
        __typename: 'TRBAdminNote',
        createdAt: '2023-02-16T15:21:34.156885Z',
        id: 'd35a1f08-e04e-48f9-8d58-7f2409bae8fe',
        isArchived: false,
        category: TRBAdminNoteCategory.GENERAL_REQUEST,
        noteText: 'Note text',
        author: {
          __typename: 'UserInfo',
          commonName: requester.userInfo.commonName
        },
        categorySpecificData: {
          __typename: 'TRBAdminNoteGeneralRequestCategoryData'
        }
      }
    }
  }
};

const documents: GetTrbRequestDocuments['trbRequest']['documents'] = [
  {
    __typename: 'TRBRequestDocument',
    fileName: 'documentOne.pdf',
    id: '9339ab0b-ef94-4d22-be9b-d40aa7f42e7e',
    documentType: {
      __typename: 'TRBRequestDocumentType',
      commonType: TRBDocumentCommonType.BUSINESS_CASE,
      otherTypeDescription: null
    },
    status: TRBRequestDocumentStatus.AVAILABLE,
    uploadedAt: ''
  },
  {
    __typename: 'TRBRequestDocument',
    fileName: 'documentTwo.pdf',
    id: 'a2229d41-7f80-4fa6-a08c-cf69e5275580',
    documentType: {
      __typename: 'TRBRequestDocumentType',
      commonType: TRBDocumentCommonType.ARCHITECTURE_DIAGRAM,
      otherTypeDescription: null
    },
    status: TRBRequestDocumentStatus.AVAILABLE,
    uploadedAt: ''
  }
];

const getTrbRequestDocumentsQuery: MockedQuery<
  GetTrbRequestDocuments,
  GetTrbRequestDocumentsVariables
> = {
  request: {
    query: GetTrbRequestDocumentsQuery,
    variables: { id: mockTrbRequestId }
  },
  result: {
    data: {
      trbRequest: {
        __typename: 'TRBRequest',
        id: mockTrbRequestId,
        documents
      }
    }
  }
};

describe('Trb Admin Notes: Add Note', () => {
  Element.prototype.scrollIntoView = vi.fn();

  const store = easiMockStore();

  it('renders conditional category fields', async () => {
    render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[getTrbRequestDocumentsQuery, getTrbRecommendationsQuery]}
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

    const categorySelect = screen.getByRole('combobox', {
      name: 'What is this note about? *'
    });

    /* Initial request form */

    userEvent.selectOptions(categorySelect, ['Initial request form']);

    expect(screen.getByText('Which section?'));
    expect(screen.getByRole('checkbox', { name: 'Basic request details' }));
    expect(screen.getByRole('checkbox', { name: 'Subject areas' }));
    expect(screen.getByRole('checkbox', { name: 'Attendees' }));

    /* Supporting documents */

    userEvent.selectOptions(categorySelect, ['Supporting documents']);
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const documentSelect = screen.getByRole('combobox', {
      name: 'Which document?'
    });

    selectEvent.openMenu(documentSelect);
    expect(screen.getByRole('checkbox', { name: documents[0].fileName }));
    expect(screen.getByRole('checkbox', { name: documents[1].fileName }));

    /* Guidance letter */

    userEvent.selectOptions(categorySelect, ['Advice letter']);
    const adviceLetterSectionSelect = screen.getByRole('combobox', {
      name: 'Which section?'
    });

    selectEvent.openMenu(adviceLetterSectionSelect);
    expect(
      screen.getByRole('checkbox', {
        name: `Recommendation (${recommendations[0].title})`
      })
    );
    expect(
      screen.getByRole('checkbox', {
        name: `Recommendation (${recommendations[1].title})`
      })
    );
  });

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
      await typeRichText(await screen.findByTestId('noteText'), 'My cute note');

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
    await typeRichText(await screen.findByTestId('noteText'), 'My cute note');

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
