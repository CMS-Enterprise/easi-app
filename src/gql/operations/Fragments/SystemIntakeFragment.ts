import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeFragment on SystemIntake {
    id
    adminLead
    businessNeed
    businessSolution
    businessOwner {
      component
      name
    }
    doesNotSupportSystems
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
    grbReviewAsyncEndDate
    grtDate
    governanceRequestFeedbacks {
      ...GovernanceRequestFeedbackFragment
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
    existingFunding
    fundingSources {
      ...FundingSourceFragment
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
      id
      component
      userAccount {
        ...UserAccount
      }
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
    usingSoftware
    acquisitionMethods
    documents {
      ...SystemIntakeDocumentFragment
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
    systemIntakeSystems {
      id
      systemIntakeID
      systemID
      systemRelationshipType
      otherSystemRelationshipDescription
      cedarSystem {
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

    grbDate
    grbReviewType
    grbPresentationLinks {
      ...SystemIntakeGRBPresentationLinksFragment
    }
    grbReviewStartedAt
    grbVotingInformation {
      grbReviewers {
        ...SystemIntakeGRBReviewer
      }
      votingStatus
      numberOfNoObjection
      numberOfObjection
      numberOfNotVoted
    }
    itGovTaskStatuses {
      intakeFormStatus
    }
  }
`);
