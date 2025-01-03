import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation UpdateTRBGuidanceLetterInsight(
    $input: UpdateTRBGuidanceLetterInsightInput!
  ) {
    updateTRBGuidanceLetterInsight(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
