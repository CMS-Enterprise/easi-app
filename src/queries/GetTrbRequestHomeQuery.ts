import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestHome($id: UUID!) {
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

      adviceLetter {
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
`;
