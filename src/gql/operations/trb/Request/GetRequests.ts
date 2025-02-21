import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetRequests {
    mySystemIntakes {
      id
      requestName
      submittedAt
      statusRequester
      statusAdmin
      grbDate
      grtDate
      systems {
        id
        name
      }
      lcid
      nextMeetingDate
      lastMeetingDate
    }
    myTrbRequests(archived: false) {
      id
      name
      submittedAt: createdAt
      status
      nextMeetingDate: consultMeetingTime
      lastMeetingDate
      systems {
        id
        name
      }
    }
  }
`);
