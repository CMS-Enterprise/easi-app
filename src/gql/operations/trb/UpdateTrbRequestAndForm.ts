import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTrbRequestAndForm(
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
