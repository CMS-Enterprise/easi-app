import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment TRBGuidanceLetterInsight on TRBGuidanceLetterInsight {
    id
    category
    title
    recommendation
    links
  }
`);
