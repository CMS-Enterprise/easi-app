import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemIntakesWithLCIDS {
    systemIntakesWithLcids {
      id
      lcid
      requestName
      lcidExpiresAt
      lcidScope
      decisionNextSteps
      trbFollowUpRecommendation
      lcidCostBaseline
    }
  }
`);
