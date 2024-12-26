import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation CreateTRBGuidanceLetterInsight(
    $input: CreateTRBGuidanceLetterInsightInput!
  ) {
    createTRBGuidanceLetterInsight(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
