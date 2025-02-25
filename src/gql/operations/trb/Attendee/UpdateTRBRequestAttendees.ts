import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBRequestAttendee($input: UpdateTRBRequestAttendeeInput!) {
    updateTRBRequestAttendee(input: $input) {
      ...TRBAttendeeFragment
    }
  }
`);
