import { gql } from '@apollo/client';

import { GovernanceRequestFeedback } from './GetGovernanceRequestFeedbackQuery';
import { SystemIntakeDocument } from './SystemIntakeDocumentQueries';

export const SystemIntake = gql`
  ${SystemIntakeDocument}
  ${GovernanceRequestFeedback}
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
      number
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
      source
      fundingNumber
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
    documents {
      ...SystemIntakeDocument
    }
    state
    decisionState
    trbFollowUpRecommendation
    requestFormState
    systems {
      id
      name
      description
      acronym
      businessOwnerOrg
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
