import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      id
      adminLead
      businessNeed
      businessSolution
      businessOwner {
        component
        name
      }
      contract {
        contractor
        endDate {
          day
          month
          year
        }
        hasContract
        startDate {
          day
          month
          year
        }
        vehicle
      }
      costs {
        isExpectingIncrease
        expectedIncreaseAmount
      }
      currentStage
      grbDate
      grtDate
      governanceTeams {
        isPresent
        teams {
          acronym
          collaborator
          key
          label
          name
        }
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
      lcid
      needsEaSupport
      productManager {
        component
        name
      }
      requester {
        component
        email
        name
      }
      requestName
      requestType
      status
      submittedAt
    }
  }
`;
