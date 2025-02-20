import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionRequestEdits(
    $input: SystemIntakeRequestEditsInput!
  ) {
    createSystemIntakeActionRequestEdits(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
