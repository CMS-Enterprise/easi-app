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
      costs {
        isExpectingIncrease
        expectedIncreaseAmount
      }
      isso {
        isPresent
        name
      }
      fundingSource {
        fundingNumber
        isFunded
        source
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
