import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequests {
    myTrbRequests(archived: false) {
      id
      name
      status
      state
      createdAt

      form {
        submittedAt
      }
    }
  }
`;
