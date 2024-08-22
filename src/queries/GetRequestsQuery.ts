import { gql } from '@apollo/client';

export default gql`
  query GetRequests {
    mySystemIntakes {
      id
      requestName
      submittedAt
      statusRequester
      statusAdmin
      grbDate
      grtDate
    }
    myTrbRequests(archived: false) {
      id
      name
      submittedAt: createdAt
      status
      nextMeetingDate: consultMeetingTime
    }
  }
`;
