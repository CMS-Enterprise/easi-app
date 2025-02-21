import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteSystemIntakeGRBPresentationLinks(
    $input: DeleteSystemIntakeGRBPresentationLinksInput!
  ) {
    deleteSystemIntakeGRBPresentationLinks(input: $input)
  }
`);
