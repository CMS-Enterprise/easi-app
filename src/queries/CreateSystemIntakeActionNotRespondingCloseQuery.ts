import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntakeActionNotRespondingClose(
    $input: BasicActionInput!
  ) {
    createSystemIntakeActionNotRespondingClose(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
