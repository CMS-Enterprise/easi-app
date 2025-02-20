import { gql } from '@apollo/client';

export default gql`
  query GetTrbTasklist($id: UUID!) {
    trbRequest(id: $id) {
      name
      type
      form {
        status
      }
      taskStatuses {
        formStatus
        feedbackStatus
        consultPrepStatus
        attendConsultStatus
        guidanceLetterStatusTaskList
      }
      feedback {
        id
      }
      consultMeetingTime

      relationType
      contractName
      contractNumbers {
        contractNumber
      }
      systems {
        id
        name
        acronym
      }
    }
  }
`;
