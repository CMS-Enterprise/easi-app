import { gql } from '@apollo/client';

import TrbRequestFormFieldsFragment from './TrbRequestFormFieldsFragment';

export default gql`
  ${TrbRequestFormFieldsFragment}
  mutation CreateTrbRequest($requestType: TRBRequestType!) {
    createTRBRequest(requestType: $requestType) {
      ...TrbRequestFormFields
    }
  }
`;
