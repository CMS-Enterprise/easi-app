import { gql } from '@apollo/client';

import TrbRequestFormFieldsFragment from './TrbRequestFormFieldsFragment';

export default gql`
  ${TrbRequestFormFieldsFragment}
  mutation UpdateTrbRequestForm(
    $input: UpdateTRBRequestFormInput!
    $id: UUID!
    $name: String
  ) {
    updateTRBRequestForm(input: $input) {
      id
    }
    updateTRBRequest(id: $id, changes: { name: $name }) {
      ...TrbRequestFormFields
    }
  }
`;
