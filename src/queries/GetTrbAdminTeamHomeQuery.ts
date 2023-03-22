import { gql } from '@apollo/client';

export default gql`
  query GetTrbAdminTeamHome {
    trbRequests(archived: false) {
      id
      name
      type
      isRecent
      status
      state
      consultMeetingTime

      trbLeadComponent
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
        adviceLetterStatus
      }

      form {
        submittedAt
      }
    }
  }
`;
