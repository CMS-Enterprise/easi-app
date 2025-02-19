import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbRequestConsultMeeting(
    $input: UpdateTRBRequestConsultMeetingTimeInput!
  ) {
    updateTRBRequestConsultMeetingTime(input: $input) {
      id
      consultMeetingTime
    }
  }
`;
