import { gql } from '@apollo/client';

import TRBGuidanceLetter from './TRBGuidanceLetter';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetter}
  query GetTRBGuidanceLetter($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      type
      createdAt
      consultMeetingTime
      taskStatuses {
        guidanceLetterStatus
      }
      guidanceLetter {
        ...TRBGuidanceLetter
      }
    }
  }
`);
