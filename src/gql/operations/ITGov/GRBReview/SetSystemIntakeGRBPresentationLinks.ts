import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SetSystemIntakeGRBPresentationLinks(
    $input: SystemIntakeGRBPresentationLinksInput!
  ) {
    setSystemIntakeGRBPresentationLinks(input: $input) {
      createdAt
    }
  }
`);
