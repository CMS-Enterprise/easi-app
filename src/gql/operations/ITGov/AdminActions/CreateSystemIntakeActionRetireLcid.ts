import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionRetireLcid(
    $input: SystemIntakeRetireLCIDInput!
  ) {
    createSystemIntakeActionRetireLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
