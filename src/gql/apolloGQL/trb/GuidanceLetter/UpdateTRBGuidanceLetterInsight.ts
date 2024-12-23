import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation UpdateTRBGuidanceLetterInsight(
    $input: UpdateTRBGuidanceLetterInsightInput!
  ) {
    updateTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
