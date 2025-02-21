import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBRequestAndForm(
    $input: UpdateTRBRequestFormInput!
    $id: UUID!
    $changes: TRBRequestChanges
  ) {
    updateTRBRequestForm(input: $input) {
      id
    }
    updateTRBRequest(id: $id, changes: $changes) {
      ...TrbRequestFormFieldsFragment
    }
  }
`);
