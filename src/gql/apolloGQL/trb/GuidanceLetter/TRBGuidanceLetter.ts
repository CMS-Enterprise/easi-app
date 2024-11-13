import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  fragment TRBGuidanceLetter on TRBGuidanceLetter {
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
`);
