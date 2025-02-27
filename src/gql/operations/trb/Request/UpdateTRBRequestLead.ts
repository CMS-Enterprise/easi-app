import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBRequestLead($input: UpdateTRBRequestTRBLeadInput!) {
    updateTRBRequestTRBLead(input: $input) {
      id
      trbLead
      trbLeadInfo {
        commonName
        email
        euaUserId
      }
    }
  }
`);
