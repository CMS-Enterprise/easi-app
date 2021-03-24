import { gql } from '@apollo/client';

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
