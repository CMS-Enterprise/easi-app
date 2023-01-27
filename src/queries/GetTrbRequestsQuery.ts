import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequests {
    trbRequests(archived: false) {
      id
      name
      status
      createdAt

      form {
        submittedAt
      }
    }
  }
`;
