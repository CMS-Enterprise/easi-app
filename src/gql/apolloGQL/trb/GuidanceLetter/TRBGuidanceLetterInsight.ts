import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment TRBGuidanceLetterInsight on TRBGuidanceLetterRecommendation {
    id
    title
    recommendation
    links
  }
`);
