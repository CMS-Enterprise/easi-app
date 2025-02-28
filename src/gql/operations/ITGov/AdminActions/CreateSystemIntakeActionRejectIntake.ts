import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeActionRejectIntake(
    $input: SystemIntakeRejectIntakeInput!
  ) {
    createSystemIntakeActionRejectIntake(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
