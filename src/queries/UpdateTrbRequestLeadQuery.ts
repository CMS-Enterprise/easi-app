import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbRequestLead($input: UpdateTRBRequestTRBLeadInput!) {
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
`;
