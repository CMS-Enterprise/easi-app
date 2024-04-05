import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestSummary($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      type
      state
      status
      trbLeadInfo {
        commonName
      }
      createdAt
      taskStatuses {
        formStatus
        feedbackStatus
        consultPrepStatus
        attendConsultStatus
        adviceLetterStatus
      }
      adminNotes {
        id
      }
      relationType
      contractName
      contractNumbers {
        id
        contractNumber
      }
      systems {
        id
        name
        description
        acronym
        businessOwnerOrg
        businessOwnerRoles {
          objectID
          assigneeFirstName
          assigneeLastName
        }
      }
    }
  }
`;
