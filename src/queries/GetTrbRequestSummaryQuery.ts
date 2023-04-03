import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestSummary($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      type
      state
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
