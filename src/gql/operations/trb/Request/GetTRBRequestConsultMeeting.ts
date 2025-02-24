import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestConsultMeeting($id: UUID!) {
    trbRequest(id: $id) {
      id
      consultMeetingTime
    }
  }
`);
