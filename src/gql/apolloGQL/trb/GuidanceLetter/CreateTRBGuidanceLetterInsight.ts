import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation CreateTRBGuidanceLetterInsight(
    $input: CreateTRBGuidanceLetterRecommendationInput!
  ) {
    createTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
