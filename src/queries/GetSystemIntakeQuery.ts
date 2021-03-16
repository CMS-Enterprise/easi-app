import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      id
      businessNeed
      businessSolution
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
      needsEaSupport
      requestName
      requestType
      status
      submittedAt
    }
  }
`;
