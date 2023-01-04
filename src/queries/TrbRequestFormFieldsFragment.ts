import { gql } from '@apollo/client';

export default gql`
  fragment TrbRequestFormFields on TRBRequest {
    id
    name
    createdBy
    type

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
    }
  }
`;
