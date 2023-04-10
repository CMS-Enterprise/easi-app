import { gql } from '@apollo/client';

const TRBAttendee = gql`
  fragment TRBAttendee on TRBRequestAttendee {
    id
    trbRequestId
    userInfo {
      commonName
      email
      euaUserId
    }
    component
    role

    createdAt
  }
`;

/**
 * Get TRB request attendees
 */

export const GetTRBRequestAttendeesQuery = gql`
  ${TRBAttendee}
  query GetTRBRequestAttendees($id: UUID!) {
    trbRequest(id: $id) {
      id
      attendees {
        ...TRBAttendee
      }
    }
  }
`;

/**
 * Create TRB request attendee
 */
export const CreateTRBRequestAttendeeQuery = gql`
  ${TRBAttendee}
  mutation CreateTRBRequestAttendee($input: CreateTRBRequestAttendeeInput!) {
    createTRBRequestAttendee(input: $input) {
      ...TRBAttendee
    }
  }
`;

/**
 * Update TRB request attendee
 */
export const UpdateTRBRequestAttendeeQuery = gql`
  ${TRBAttendee}
  mutation UpdateTRBRequestAttendee($input: UpdateTRBRequestAttendeeInput!) {
    updateTRBRequestAttendee(input: $input) {
      ...TRBAttendee
    }
  }
`;

/**
 * Delete TRB request attendee
 */
export const DeleteTRBRequestAttendeeQuery = gql`
  ${TRBAttendee}
  mutation DeleteTRBRequestAttendee($id: UUID!) {
    deleteTRBRequestAttendee(id: $id) {
      ...TRBAttendee
    }
  }
`;
