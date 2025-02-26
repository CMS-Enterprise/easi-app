import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionRequestEdits(
    $input: SystemIntakeRequestEditsInput!
  ) {
    createSystemIntakeActionRequestEdits(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
