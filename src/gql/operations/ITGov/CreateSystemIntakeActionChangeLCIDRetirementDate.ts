import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionChangeLCIDRetirementDate(
    $input: SystemIntakeChangeLCIDRetirementDateInput!
  ) {
    createSystemIntakeActionChangeLCIDRetirementDate(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
