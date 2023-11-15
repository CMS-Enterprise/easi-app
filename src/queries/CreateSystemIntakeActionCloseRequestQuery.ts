import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionCloseRequest(
    $input: SystemIntakeCloseRequestInput!
  ) {
    createSystemIntakeActionCloseRequest(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
