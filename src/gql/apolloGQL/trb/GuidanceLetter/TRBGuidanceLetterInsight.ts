import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment TRBGuidanceLetterInsight on TRBGuidanceLetterRecommendation {
    id
    category
    title
    recommendation
    links
  }
`);
