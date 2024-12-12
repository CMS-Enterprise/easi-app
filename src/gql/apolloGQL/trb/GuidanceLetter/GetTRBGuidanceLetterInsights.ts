import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  query GetTRBGuidanceLetterInsights($id: UUID!) {
    trbRequest(id: $id) {
      guidanceLetter {
        insights {
          ...TRBGuidanceLetterInsight
        }
      }
    }
  }
`);
