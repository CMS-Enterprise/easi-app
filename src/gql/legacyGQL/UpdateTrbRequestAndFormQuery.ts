import { gql } from '@apollo/client';

import TrbRequestFormFieldsFragment from './TrbRequestFormFieldsFragment';

export default gql`
  ${TrbRequestFormFieldsFragment}
  mutation UpdateTrbRequestAndForm(
    $input: UpdateTRBRequestFormInput!
    $id: UUID!
    $changes: TRBRequestChanges
  ) {
    updateTRBRequestForm(input: $input) {
      id
    }
    updateTRBRequest(id: $id, changes: $changes) {
      ...TrbRequestFormFields
    }
  }
`;
