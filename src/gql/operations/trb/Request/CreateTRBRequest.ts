import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateTRBRequest($requestType: TRBRequestType!) {
    createTRBRequest(requestType: $requestType) {
      ...TrbRequestFormFieldsFragment
    }
  }
`);
