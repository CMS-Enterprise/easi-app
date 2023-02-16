import { gql } from '@apollo/client';

export default gql`
  fragment TrbRequestFormFields on TRBRequest {
    id
    name
    type
    status
    taskStatuses {
      formStatus
      feedbackStatus
      consultPrepStatus
      attendConsultStatus
      adviceLetterStatus
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

      subjectAreaTechnicalReferenceArchitecture
      subjectAreaNetworkAndSecurity
      subjectAreaCloudAndInfrastructure
      subjectAreaApplicationDevelopment
      subjectAreaDataAndDataManagement
      subjectAreaGovernmentProcessesAndPolicies
      subjectAreaOtherTechnicalTopics
      subjectAreaTechnicalReferenceArchitectureOther
      subjectAreaNetworkAndSecurityOther
      subjectAreaCloudAndInfrastructureOther
      subjectAreaApplicationDevelopmentOther
      subjectAreaDataAndDataManagementOther
      subjectAreaGovernmentProcessesAndPoliciesOther
      subjectAreaOtherTechnicalTopicsOther

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
  }
`;
