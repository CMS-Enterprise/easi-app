import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateTRBRequestAttendee($input: CreateTRBRequestAttendeeInput!) {
    createTRBRequestAttendee(input: $input) {
      ...TRBAttendeeFragment
    }
  }
`);
