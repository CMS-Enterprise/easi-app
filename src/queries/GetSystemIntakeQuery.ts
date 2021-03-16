import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      id
      businessOwner {
        component
        name
      }
      isso {
        isPresent
        name
      }
      productManager {
        component
        name
      }
      requester {
        component
        email
        name
      }
      lcid
      requestName
      requestType
      status
      submittedAt
    }
  }
`;
