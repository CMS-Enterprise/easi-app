import { gql } from '@apollo/client';

export default gql`
  mutation CreateSystemIntake($input: CreateSystemIntakeInput!) {
    createSystemIntake(input: $input) {
      id
      status
      requestType
      requester {
        name
      }
    }
  }
`;
