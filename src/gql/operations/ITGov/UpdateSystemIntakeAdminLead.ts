import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSystemIntakeAdminLead(
    $input: UpdateSystemIntakeAdminLeadInput!
  ) {
    updateSystemIntakeAdminLead(input: $input) {
      systemIntake {
        adminLead
        id
      }
    }
  }
`);
