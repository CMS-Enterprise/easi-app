import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionUnretireLCID(
    $input: SystemIntakeUnretireLCIDInput!
  ) {
    createSystemIntakeActionUnretireLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
