import { gql } from '@apollo/client';

// TODO: Remove after IT Gov v2 actions are launched

export default gql`
  mutation CreateSystemIntakeActionNotItRequest($input: BasicActionInput!) {
    createSystemIntakeActionNotItRequest(input: $input) {
      systemIntake {
        status
        id
      }
    }
  }
`;
