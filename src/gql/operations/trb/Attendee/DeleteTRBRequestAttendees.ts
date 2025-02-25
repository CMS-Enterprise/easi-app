import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteTRBRequestAttendee($id: UUID!) {
    deleteTRBRequestAttendee(id: $id) {
      ...TRBAttendeeFragment
    }
  }
`);
