import { gql } from '@apollo/client';

import TRBGuidanceLetterInsight from './TRBGuidanceLetterInsight';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetterInsight}
  mutation DeleteTRBGuidanceLetterInsight($id: UUID!) {
    deleteTRBGuidanceLetterInsight(id: $id) {
      ...TRBGuidanceLetterInsight
    }
  }
`);
