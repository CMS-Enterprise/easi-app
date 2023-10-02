import { gql } from '@apollo/client';

const SystemIntakeForCsv = gql`
  fragment SystemIntakeForCsv on SystemIntake {
    id
    euaUserId
    requestName
    requestType
    status
    state

    requester {
      name
      component
    }
    businessOwner {
      name
      component
    }
    productManager {
      name
      component
    }
    isso {
      name
    }

    governanceTeams {
      isPresent
      teams {
        collaborator
      }
    }

    existingFunding
    fundingSources {
      source
      fundingNumber
    }

    contract {
      hasContract
      contractor
      number
      startDate {
        day
        month
        year
      }
      endDate {
        day
        month
        year
      }
    }

    businessNeed
    businessSolution
    currentStage
    needsEaSupport

    lcid
    lcidScope

    adminLead

    notes {
      id
      createdAt
    }

    actions {
      id
      createdAt
    }

    decidedAt
    submittedAt
    updatedAt
    createdAt
    archivedAt
  }
`;

export default gql`
  ${SystemIntakeForCsv}
  query GetSystemIntakesTable {
    systemIntakes {
      ...SystemIntakeForCsv
    }
  }
`;
