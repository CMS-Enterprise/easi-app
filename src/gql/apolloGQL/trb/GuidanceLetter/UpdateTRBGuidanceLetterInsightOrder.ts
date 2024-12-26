import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation UpdateTRBGuidanceLetterInsightOrder(
    $input: UpdateTRBGuidanceLetterRecommendationOrderInput!
  ) {
    updateTRBGuidanceLetterInsightOrder(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
