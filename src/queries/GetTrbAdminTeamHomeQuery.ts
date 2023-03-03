import { gql } from '@apollo/client';

export default gql`
  query GetTrbAdminTeamHome {
    trbRequests(archived: false) {
      id
      name
      type
      isRecent
      status
      trbLead
      consultMeetingTime

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
