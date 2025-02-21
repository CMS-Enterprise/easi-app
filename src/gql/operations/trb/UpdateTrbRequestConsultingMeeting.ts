import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBRequestConsultMeeting(
    $input: UpdateTRBRequestConsultMeetingTimeInput!
  ) {
    updateTRBRequestConsultMeetingTime(input: $input) {
      id
      consultMeetingTime
    }
  }
`);
