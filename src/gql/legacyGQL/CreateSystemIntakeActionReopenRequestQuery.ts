import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionReopenRequest(
    $input: SystemIntakeReopenRequestInput!
  ) {
    createSystemIntakeActionReopenRequest(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
