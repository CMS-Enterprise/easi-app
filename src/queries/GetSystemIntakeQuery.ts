import { gql } from '@apollo/client';

import { GovernanceRequestFeedback } from './GetGovernanceRequestFeedbackQuery';
import { SystemIntakeDocument } from './SystemIntakeDocumentQueries';

export const FundingSource = gql`
  fragment FundingSource on SystemIntakeFundingSource {
    id
    fundingNumber
    source
  }
`;

export const SystemIntake = gql`
  ${SystemIntakeDocument}
  ${GovernanceRequestFeedback}
  ${FundingSource}
  fragment SystemIntake on SystemIntake {
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
    contractNumbers {
      id
      contractNumber
    }
    costs {
      isExpectingIncrease
      expectedIncreaseAmount
    }
    annualSpending {
      currentAnnualSpending
      currentAnnualSpendingITPortion
      plannedYearOneSpending
      plannedYearOneSpendingITPortion
    }
    currentStage
    decisionNextSteps
    grbDate
    grtDate
    governanceRequestFeedbacks {
      ...GovernanceRequestFeedback
    }
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
    existingFunding
    fundingSources {
      ...FundingSource
    }
    lcid
    lcidIssuedAt
    lcidExpiresAt
    lcidRetiresAt
    lcidScope
    lcidCostBaseline
    lcidStatus
    needsEaSupport
    productManager {
      component
      name
    }
    rejectionReason
    requester {
      component
      email
      name
    }
    requestName
    requestType
    statusAdmin
    statusRequester
    grtReviewEmailBody
    decidedAt
    businessCaseId
    submittedAt
    updatedAt
    createdAt
    archivedAt
    euaUserId
    hasUiChanges
    usesAiTech
    documents {
      ...SystemIntakeDocument
    }
    state
    decisionState
    trbFollowUpRecommendation
    requestFormState
    relationType
    contractName
    contractNumbers {
      id
      contractNumber
    }
    systems {
      id
      name
      description
      acronym
      businessOwnerOrg
      businessOwnerRoles {
        objectID
        assigneeFirstName
        assigneeLastName
      }
    }
    relatedTRBRequests {
      id
      name
      contractNumbers {
        contractNumber
      }
      status
      createdAt
    }
    relatedIntakes {
      id
      requestName
      contractNumbers {
        contractNumber
      }
      decisionState
      submittedAt
    }
  }
`;

export default gql`
  ${SystemIntake}
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      ...SystemIntake
    }
  }
`;
