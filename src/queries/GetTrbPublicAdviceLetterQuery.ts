import { gql } from '@apollo/client';

import { TRBAdviceLetter } from './TrbAdviceLetterQueries';

export default gql`
  ${TRBAdviceLetter}
  query GetTrbPublicAdviceLetter($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      requesterInfo {
        commonName
      }
      requesterComponent
      form {
        id
        submittedAt # submission date
        component # request component
        needsAssistanceWith
      }
      type
      consultMeetingTime
      adviceLetter {
        ...TRBAdviceLetter
      }
      taskStatuses {
        adviceLetterStatus
      }
    }
  }
`;
