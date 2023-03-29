import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestHome($id: UUID!) {
    trbRequest(id: $id) {
      id
      consultMeetingTime

      taskStatuses {
        formStatus
        adviceLetterStatus
      }

      form {
        id
        modifiedAt
      }

      adviceLetter {
        id
        modifiedAt
      }

      trbLeadComponent
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
