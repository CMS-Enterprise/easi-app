import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestHome($id: UUID!) {
    trbRequest(id: $id) {
      id
      consultMeetingTime

      taskStatuses {
        formStatus
        guidanceLetterStatus
      }

      form {
        id
        modifiedAt
      }

      guidanceLetter {
        id
        modifiedAt
      }

      trbLeadInfo {
        commonName
        email
      }

      documents {
        id
      }

      adminNotes {
        id
      }
    }
  }
`);
