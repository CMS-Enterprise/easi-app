import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionUpdateLCID(
    $input: SystemIntakeUpdateLCIDInput!
  ) {
    createSystemIntakeActionUpdateLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
