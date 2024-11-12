import { gql } from '@apollo/client';

export const TRBAdminNoteInitialRequestFormCategoryData = gql(/* GraphQL */ `
  fragment TRBAdminNoteInitialRequestFormCategoryData on TRBAdminNoteInitialRequestFormCategoryData {
    appliesToBasicRequestDetails
    appliesToSubjectAreas
    appliesToAttendees
  }
`);

export const TRBAdminNoteSupportingDocumentsCategoryData = gql(/* GraphQL */ `
  fragment TRBAdminNoteSupportingDocumentsCategoryData on TRBAdminNoteSupportingDocumentsCategoryData {
    documents {
      id
      fileName
      deletedAt
    }
  }
`);

export const TRBAdminNoteGuidanceLetterCategoryData = gql(/* GraphQL */ `
  fragment TRBAdminNoteGuidanceLetterCategoryData on TRBAdminNoteGuidanceLetterCategoryData {
    appliesToMeetingSummary
    appliesToNextSteps
    insights {
      id
      category
      title
      deletedAt
    }
  }
`);

export default gql(/* GraphQL */ `
  ${TRBAdminNoteInitialRequestFormCategoryData}
  ${TRBAdminNoteSupportingDocumentsCategoryData}
  ${TRBAdminNoteGuidanceLetterCategoryData}

  fragment TRBAdminNote on TRBAdminNote {
    id
    isArchived
    category
    noteText

    author {
      commonName
    }
    createdAt

    categorySpecificData {
      ... on TRBAdminNoteInitialRequestFormCategoryData {
        ...TRBAdminNoteInitialRequestFormCategoryData
      }

      ... on TRBAdminNoteSupportingDocumentsCategoryData {
        ...TRBAdminNoteSupportingDocumentsCategoryData
      }

      ... on TRBAdminNoteGuidanceLetterCategoryData {
        ...TRBAdminNoteGuidanceLetterCategoryData
      }
    }
  }
`);
