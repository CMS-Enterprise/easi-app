import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UploadSystemIntakeGRBPresentationDeck(
    $input: UploadSystemIntakeGRBPresentationDeckInput!
  ) {
    uploadSystemIntakeGRBPresentationDeck(input: $input) {
      createdAt
    }
  }
`);
