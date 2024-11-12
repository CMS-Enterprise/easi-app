import { gql } from '@apollo/client';

export default gql`
  fragment TrbRequestFormFields on TRBRequest {
    id
    name
    type
    state
    taskStatuses {
      formStatus
      feedbackStatus
      consultPrepStatus
      attendConsultStatus
      guidanceLetterStatus
    }

    form {
      id

      component
      needsAssistanceWith
      hasSolutionInMind
      proposedSolution
      whereInProcess
      whereInProcessOther
      hasExpectedStartEndDates
      expectedStartDate
      expectedEndDate
      collabGroups
      collabDateSecurity
      collabDateEnterpriseArchitecture
      collabDateCloud
      collabDatePrivacyAdvisor
      collabDateGovernanceReviewBoard
      collabDateOther
      collabGroupOther
      collabGRBConsultRequested
      subjectAreaOptions
      subjectAreaOptionOther
      fundingSources {
        id
        fundingNumber
        source
      }

      systemIntakes {
        id
        requestName
        lcid
      }

      submittedAt
    }

    feedback {
      id
      action
      feedbackMessage
      author {
        commonName
      }
      createdAt
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
