import { gql } from '@apollo/client';

export default gql`
  mutation CreateTrbRequest($requestType: TRBRequestType!) {
    createTRBRequest(requestType: $requestType) {
      id
      name
      status
      createdAt
    }
  }
`;
