import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestSummary($id: UUID!) {
    trbRequest(id: $id) {
      name
      type
      status
      trbLead
      createdAt
      taskStatuses {
        formStatus
        feedbackStatus
        consultPrepStatus
        attendConsultStatus
        adviceLetterStatus
      }
    }
  }
`;
