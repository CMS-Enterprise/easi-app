import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTrbRequestConsultMeeting(
    $input: UpdateTRBRequestConsultMeetingTimeInput!
  ) {
    updateTRBRequestConsultMeetingTime(input: $input) {
      id
      consultMeetingTime
    }
  }
`);
