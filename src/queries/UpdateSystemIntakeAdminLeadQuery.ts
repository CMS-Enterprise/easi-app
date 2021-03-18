import { gql } from '@apollo/client';

export default gql`
  mutation UpdateSystemIntakeAdminLead(
    $input: UpdateSystemIntakeAdminLeadInput!
  ) {
    updateSystemIntakeAdminLead(input: $input) {
      adminLead
    }
  }
`;
