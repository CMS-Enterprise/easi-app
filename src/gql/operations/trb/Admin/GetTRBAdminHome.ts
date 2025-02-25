import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBAdminHome {
    trbRequests(archived: false) {
      id
      name
      type
      isRecent
      status
      state
      consultMeetingTime

      trbLeadInfo {
        commonName
      }

      requesterComponent
      requesterInfo {
        commonName
      }

      taskStatuses {
        formStatus
        feedbackStatus
        consultPrepStatus
        attendConsultStatus
        guidanceLetterStatus
      }

      form {
        submittedAt
      }

      contractName
      contractNumbers {
        contractNumber
      }
      systems {
        id
        name
      }
    }
  }
`);
