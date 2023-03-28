import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestHome($id: UUID!) {
    trbRequest(id: $id) {
      id
      taskStatuses {
        formStatus
        adviceLetterStatus
      }
      form {
        id
        modifiedAt
        createdBy
      }
      adviceLetter {
        id
        modifiedAt
      }
      consultMeetingTime
      trbLeadInfo {
        commonName
        email
      }
      trbLeadComponent
      requesterInfo {
        commonName
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
