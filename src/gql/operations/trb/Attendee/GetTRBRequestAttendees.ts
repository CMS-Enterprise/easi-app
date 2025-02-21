import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestAttendees($id: UUID!) {
    trbRequest(id: $id) {
      id
      attendees {
        ...TRBAttendeeFragment
      }
    }
  }
`);
