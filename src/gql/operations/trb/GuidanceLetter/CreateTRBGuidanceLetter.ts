import { gql } from '@apollo/client';

import TRBGuidanceLetter from './TRBGuidanceLetter';

export default gql(/* GraphQL */ `
  ${TRBGuidanceLetter}
  mutation CreateTRBGuidanceLetter($trbRequestId: UUID!) {
    createTRBGuidanceLetter(trbRequestId: $trbRequestId) {
      ...TRBGuidanceLetter
    }
  }
`);
