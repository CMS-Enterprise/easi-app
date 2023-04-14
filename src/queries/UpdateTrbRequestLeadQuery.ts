import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbRequestLead($input: UpdateTRBRequestTRBLeadInput!) {
    updateTRBRequestTRBLead(input: $input) {
      id
      trbLead
      trbLeadComponent
      trbLeadInfo {
        commonName
        email
        euaUserId
      }
    }
  }
`;
