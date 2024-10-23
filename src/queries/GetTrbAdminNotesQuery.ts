import { gql } from '@apollo/client';

export const TRBAdminNoteFragment = gql`
  fragment TRBAdminNoteFragment on TRBAdminNote {
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
        appliesToBasicRequestDetails
        appliesToSubjectAreas
        appliesToAttendees
      }

      ... on TRBAdminNoteSupportingDocumentsCategoryData {
        documents {
          fileName
          deletedAt
        }
      }

      ... on TRBAdminNoteGuidanceLetterCategoryData {
        appliesToMeetingSummary
        appliesToNextSteps
        insights {
          title
          deletedAt
        }
      }
    }
  }
`;

export default gql`
  ${TRBAdminNoteFragment}
  query GetTrbAdminNotes($id: UUID!) {
    trbRequest(id: $id) {
      id
      adminNotes {
        ...TRBAdminNoteFragment
      }
    }
  }
`;
