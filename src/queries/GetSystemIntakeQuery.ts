import { gql } from '@apollo/client';

import { SystemIntakeDocument } from './SystemIntakeDocumentQueries';

export const SystemIntake = gql`
  ${SystemIntakeDocument}
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
      plannedYearOneSpending
    }
    currentStage
    decisionNextSteps
    grbDate
    grtDate
    grtFeedbacks {
      feedback
      feedbackType
      createdAt
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
    lcidExpiresAt
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
    status
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
