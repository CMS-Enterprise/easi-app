import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      id
      requester {
        component
        email
        name
      }
      submittedAt
    }
  }
`;
