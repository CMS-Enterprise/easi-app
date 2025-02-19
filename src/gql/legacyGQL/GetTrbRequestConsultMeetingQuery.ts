import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestConsultMeeting($id: UUID!) {
    trbRequest(id: $id) {
      id
      consultMeetingTime
    }
  }
`;
