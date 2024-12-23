import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation CreateTRBGuidanceLetterInsight(
    $input: CreateTRBGuidanceLetterInsightInput!
  ) {
    createTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
