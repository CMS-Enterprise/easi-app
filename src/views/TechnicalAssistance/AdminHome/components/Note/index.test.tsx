import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  TRBAdminNoteCategory,
  TRBAdminNoteFragment,
  TRBGuidanceLetterInsightCategory
} from 'gql/gen/graphql';

import { formatDateLocal } from 'utils/date';

import Note from '.';

const noteInitialRequestForm: TRBAdminNoteFragment = {
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
};

const noteSupportingDocuments: TRBAdminNoteFragment = {
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
        id: 'fcf17154-1d3b-46ac-a45c-33a29aaf9ec0',
        fileName: 'documentOne.pdf',
        deletedAt: null
      },
      {
        __typename: 'TRBRequestDocument',
        id: '27b0d48b-817a-4ed6-be9a-6a83c25280e1',
        fileName: 'documentTwo.pdf',
        deletedAt: null
      }
    ]
  },
  createdAt: '2024-03-27T13:20:37.852099Z'
};

const noteGuidanceLetter: TRBAdminNoteFragment = {
  __typename: 'TRBAdminNote',
  id: 'badd3c6c-86f2-40fd-af1b-4ab46c4f8c34',
  isArchived: false,
  category: TRBAdminNoteCategory.GUIDANCE_LETTER,
  noteText: 'Guidance Letter Note',
  author: {
    __typename: 'UserInfo',
    commonName: 'Jerry Seinfeld'
  },
  categorySpecificData: {
    __typename: 'TRBAdminNoteGuidanceLetterCategoryData',
    appliesToMeetingSummary: true,
    appliesToNextSteps: false,
    insights: [
      {
        __typename: 'TRBGuidanceLetterInsight',
        category: TRBGuidanceLetterInsightCategory.RECOMMENDATION,
        id: 'bcbd8b3e-75e7-456e-8574-c5ab0b47e0bd',
        title: 'Test Recommendation',
        deletedAt: null
      },
      {
        __typename: 'TRBGuidanceLetterInsight',
        category: TRBGuidanceLetterInsightCategory.REQUIREMENT,
        id: '2481f229-b7e9-4056-96a6-2857c8f29af1',
        title: 'Test Requirement',
        deletedAt: null
      }
    ]
  },
  createdAt: '2024-03-26T13:20:37.852099Z'
};

const noteGeneralRequest: TRBAdminNoteFragment = {
  id: '861fa6c5-c9af-4cda-a559-0995b7b76855',
  isArchived: false,
  category: TRBAdminNoteCategory.GENERAL_REQUEST,
  noteText: 'My cute note',
  author: {
    __typename: 'UserInfo',
    commonName: 'Jerry Seinfeld'
  },
  createdAt: '2023-03-28T13:20:37.852099Z',
  __typename: 'TRBAdminNote',
  categorySpecificData: {
    __typename: 'TRBAdminNoteGeneralRequestCategoryData'
  }
};

describe('TRB Admin Note', () => {
  it('Renders correct note information', () => {
    const note = noteGeneralRequest;
    const { asFragment } = render(<Note note={note} />);

    const submissionDate = formatDateLocal(note.createdAt, 'MMMM d, yyyy');
    expect(screen.getByText(submissionDate)).toBeInTheDocument();

    expect(screen.getByText(note.author.commonName)).toBeInTheDocument();

    expect(
      screen.getByText('General note about this request')
    ).toBeInTheDocument();

    expect(screen.getByText(note.noteText)).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders category specific data - initial request form', () => {
    const note = noteInitialRequestForm;
    render(<Note note={note} />);

    expect(
      screen.getByText(
        'Initial request form: Basic request details, Subject areas'
      )
    ).toBeInTheDocument();
  });

  it('Renders category specific data - supporting documents', () => {
    const note = noteSupportingDocuments;
    render(<Note note={note} />);

    expect(
      screen.getByText('Supporting documents: documentOne.pdf, documentTwo.pdf')
    ).toBeInTheDocument();
  });

  it('Renders category specific data - guidance letter', () => {
    const note = noteGuidanceLetter;
    render(<Note note={note} />);

    expect(
      screen.getByText(
        'Guidance letter: Meeting summary, Recommendation (Test Recommendation), Requirement (Test Requirement)'
      )
    ).toBeInTheDocument();
  });

  it('Renders label for removed document', () => {
    const note: TRBAdminNoteFragment = {
      ...noteSupportingDocuments,
      categorySpecificData: {
        __typename: 'TRBAdminNoteSupportingDocumentsCategoryData',
        documents: [
          {
            __typename: 'TRBRequestDocument',
            id: '8f41533f-6cfa-4e18-aa54-9ccbafafcb88',
            fileName: 'documentOne.pdf',
            deletedAt: '2023-03-28T13:20:37.852099Z'
          }
        ]
      }
    };
    render(<Note note={note} />);

    expect(
      screen.getByText(
        'Supporting documents: Removed document (documentOne.pdf)'
      )
    ).toBeInTheDocument();
  });

  it('Renders label for removed insight', () => {
    const note: TRBAdminNoteFragment = {
      ...noteGuidanceLetter,
      categorySpecificData: {
        __typename: 'TRBAdminNoteGuidanceLetterCategoryData',
        appliesToMeetingSummary: true,
        appliesToNextSteps: false,
        insights: [
          {
            __typename: 'TRBGuidanceLetterInsight',
            id: 'b97d4633-42d6-4817-9e88-919928e149e5',
            title: 'Test Recommendation',
            category: TRBGuidanceLetterInsightCategory.RECOMMENDATION,
            deletedAt: '2023-03-28T13:20:37.852099Z'
          }
        ]
      }
    };
    render(<Note note={note} />);

    expect(
      screen.getByText(
        'Guidance letter: Meeting summary, Removed recommendation (Test Recommendation)'
      )
    ).toBeInTheDocument();
  });
});
