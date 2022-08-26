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
        number
      }
      costs {
        isExpectingIncrease
        expectedIncreaseAmount
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
      lastAdminNote {
        content
        createdAt
      }
    }
  }
`;
