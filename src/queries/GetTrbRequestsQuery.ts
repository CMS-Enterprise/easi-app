import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequests {
    trbRequestCollection(archived: false) {
      id
      name
      status
      createdAt
    }
  }
`;
