import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionRejectIntake(
    $input: SystemIntakeRejectIntakeInput!
  ) {
    createSystemIntakeActionRejectIntake(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
