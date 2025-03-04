import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionReopenRequest(
    $input: SystemIntakeReopenRequestInput!
  ) {
    createSystemIntakeActionReopenRequest(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
