import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestLcidOptions($trbRequestID: UUID!) {
    trbRequestLcidOptions(trbRequestID: $trbRequestID) {
      id
      lcid
      requestName
    }
  }
`);
