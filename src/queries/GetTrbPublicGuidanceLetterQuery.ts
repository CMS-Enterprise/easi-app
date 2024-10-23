import { gql } from '@apollo/client';

import { TRBGuidanceLetter } from './TrbGuidanceLetterQueries';

export default gql`
  ${TRBGuidanceLetter}
  query GetTrbPublicGuidanceLetter($id: UUID!) {
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
      guidanceLetter {
        ...TRBGuidanceLetter
      }
      taskStatuses {
        guidanceLetterStatus
      }
    }
  }
`;
