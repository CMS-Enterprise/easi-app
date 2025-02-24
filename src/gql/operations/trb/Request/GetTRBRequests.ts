import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequests {
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
`);
