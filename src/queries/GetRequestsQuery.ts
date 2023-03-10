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
          statusCreatedAt
          lcid
          nextMeetingDate
        }
      }
    }
    trbRequests(archived: false) {
      id
      name
      submittedAt: createdAt
      status
      nextMeetingDate: consultMeetingTime
    }
  }
`;
