import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const CreateSystemIntake = gql`
  mutation CreateSystemIntake($input: CreateSystemIntakeInput!) {
    createSystemIntake(input: $input) {
      requestType
      requester {
        name
        email
      }
    }
  }
`;
