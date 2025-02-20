import { gql } from '@apollo/client';

import TRBGuidanceLetter from './TRBGuidanceLetter';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetter}
  mutation UpdateTRBGuidanceLetter($input: UpdateTRBGuidanceLetterInput!) {
    updateTRBGuidanceLetter(input: $input) {
      ...TRBGuidanceLetter
    }
  }
`);
