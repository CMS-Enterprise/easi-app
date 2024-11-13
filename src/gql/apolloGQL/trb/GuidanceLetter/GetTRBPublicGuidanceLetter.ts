import { gql } from '@apollo/client';

import TRBGuidanceLetter from './TRBGuidanceLetter';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetter}
  query GetTRBPublicGuidanceLetter($id: UUID!) {
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
        id
        meetingSummary
        nextSteps
        isFollowupRecommended
        dateSent
        followupPoint
        insights {
          ...TRBGuidanceLetterInsight
        }
        author {
          euaUserId
          commonName
        }
        createdAt
        modifiedAt
      }
      taskStatuses {
        guidanceLetterStatus
      }
    }
  }
`);
