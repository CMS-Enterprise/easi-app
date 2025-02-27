import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionExpireLCID(
    $input: SystemIntakeExpireLCIDInput!
  ) {
    createSystemIntakeActionExpireLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
