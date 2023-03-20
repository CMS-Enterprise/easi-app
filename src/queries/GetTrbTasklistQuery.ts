import { gql } from '@apollo/client';

export default gql`
  query GetTrbTasklist($id: UUID!) {
    trbRequest(id: $id) {
      type
      form {
        status
      }
      taskStatuses {
        formStatus
        feedbackStatus
        consultPrepStatus
        attendConsultStatus
        adviceLetterStatus
      }
      feedback {
        id
      }
      consultMeetingTime
    }
  }
`;
