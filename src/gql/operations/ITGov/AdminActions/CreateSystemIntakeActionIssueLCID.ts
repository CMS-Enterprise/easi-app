import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionIssueLCID(
    $input: SystemIntakeIssueLCIDInput!
  ) {
    createSystemIntakeActionIssueLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
