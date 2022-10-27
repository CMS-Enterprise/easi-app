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

export const GetTRBRequestAttendees = gql`
  ${TRBAttendee}
  query GetTRBRequestAttendees($id: UUID!) {
    trbRequest(id: $id) {
      attendees {
        ...TRBAttendee
      }
    }
  }
`;

/**
 * Create TRB request attendee
 */
export const CreateTRBRequestAttendee = gql`
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
export const UpdateTRBRequestAttendee = gql`
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
export const DeleteTRBRequestAttendee = gql`
  ${TRBAttendee}
  mutation DeleteTRBRequestAttendee($id: UUID!) {
    deleteTRBRequestAttendee(id: $id) {
      ...TRBAttendee
    }
  }
`;
