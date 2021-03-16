import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      id
      businessOwner {
        component
        name
      }
      requester {
        component
        email
        name
      }
      lcid
      projectName
      requestType
      status
      submittedAt
    }
  }
`;
