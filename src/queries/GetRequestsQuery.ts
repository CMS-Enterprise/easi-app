import { gql } from '@apollo/client';

export default gql`
  query GetRequests($first: Int!) {
    requests(first: $first) {
      edges {
        node {
          id
          name
          submittedAt
          type
          status
        }
      }
    }
  }
`;
