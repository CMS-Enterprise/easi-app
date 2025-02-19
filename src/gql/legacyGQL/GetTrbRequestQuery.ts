import { gql } from '@apollo/client';

import TrbRequestFormFieldsFragment from './TrbRequestFormFieldsFragment';

export default gql`
  ${TrbRequestFormFieldsFragment}
  query GetTrbRequest($id: UUID!) {
    trbRequest(id: $id) {
      ...TrbRequestFormFields
    }
  }
`;
