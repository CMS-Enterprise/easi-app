import { gql } from '@apollo/client';

export default gql`
  fragment TrbRequestFormFields on TRBRequest {
    id
    name
    createdBy
    createdAt
    type
    status
    taskStatuses {
      formStatus
      feedbackStatus
      consultPrepStatus
      attendConsultStatus
    }
    trbLead

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
      feedbackMessage
      notifyEuaIds
      createdBy
      createdAt
    }
  }
`;
