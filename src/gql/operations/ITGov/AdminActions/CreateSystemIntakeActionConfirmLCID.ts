import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionConfirmLCID(
    $input: SystemIntakeConfirmLCIDInput!
  ) {
    createSystemIntakeActionConfirmLCID(input: $input) {
      systemIntake {
        id
        lcid
      }
    }
  }
`);
