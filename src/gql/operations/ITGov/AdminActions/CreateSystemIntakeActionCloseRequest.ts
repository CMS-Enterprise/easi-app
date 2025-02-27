import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionCloseRequest(
    $input: SystemIntakeCloseRequestInput!
  ) {
    createSystemIntakeActionCloseRequest(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
