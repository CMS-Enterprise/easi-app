import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntakesTable {
    systemIntakes {
      id
      euaUserId
      requestName
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

      trbCollaboratorName
      oitSecurityCollaboratorName
      eaCollaboratorName

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
      grtDate
      grbDate

      lcid
      lcidScope
      lcidExpiresAt

      adminLead

      notes {
        id
        createdAt
        content
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
  }
`;
