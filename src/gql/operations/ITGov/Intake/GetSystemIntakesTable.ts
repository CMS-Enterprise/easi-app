import { gql } from '@apollo/client';

/**
 * For use on requests table
 *
 * Returns all system intakes that have a submitted Intake Request form
 */
export default gql(/* GraphQL */ `
  query GetSystemIntakesTable($openRequests: Boolean!) {
    systemIntakes(openRequests: $openRequests) {
      id
      euaUserId
      requestName
      projectAcronym
      statusAdmin
      state

      requester {
        id
        component
        userAccount {
          id
          username
          commonName
        }
      }

      businessOwner {
        name
        component
      }
      productManager {
        name
        component
      }

      trbCollaboratorName
      oitSecurityCollaboratorName
      eaCollaboratorName
      collaboratorName508

      existingFunding
      fundingSources {
        ...FundingSourceFragment
      }

      annualSpending {
        currentAnnualSpending
        currentAnnualSpendingITPortion
        plannedYearOneSpending
        plannedYearOneSpendingITPortion
      }

      totalContractCosts {
        currentEstimatedCost
        currentEstimatedCostITPortion
        estimatedTotalContractValue
        estimatedTotalContractValueITPortion
      }

      contract {
        hasContract
        contractor
        vehicle
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

      contractName
      contractNumbers {
        contractNumber
      }
      systems {
        id
        name
      }

      businessNeed
      businessSolution
      priorityAlignment
      currentStage
      needsEaSupport
      grtDate
      grbDate

      lcid
      lcidDisplay
      lcidScope
      lcidIssuedAt
      lcidExpiresAt
      lcidType
      lcidComponent
      lcidIsShortened
      lcidIsLowIt

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

      hasUiChanges
      digitalServiceInteraction
      digitalServiceInteractionDescription
      protectedCmsDataAccessedOutside
      protectedCmsDataAccessedOutsideDescription
      usesAiTech
      usingSoftware
      acquisitionMethods

      decidedAt
      submittedAt
      updatedAt
      createdAt
      archivedAt
    }
  }
`);
