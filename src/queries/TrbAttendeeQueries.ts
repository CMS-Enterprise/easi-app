import { gql } from '@apollo/client';

/**
 * Get TRB request attendees
 */

export const GetTRBRequestAttendees = gql`
  query GetTRBRequestAttendees($id: UUID!) {
    trbRequest(id: $id) {
      attendees {
        id
        euaUserId
        trbRequestId
        component
        role
        createdAt
      }
    }
  }
`;

/**
 * Create TRB request attendee
 */
export const CreateTRBRequestAttendee = gql`
  mutation CreateTRBRequestAttendee($input: CreateTRBRequestAttendeeInput!) {
    createTRBRequestAttendee(input: $input) {
      id
      euaUserId
      trbRequestId
      component
      role
      createdAt
    }
  }
`;

/**
 * Update TRB request attendee
 */
export const UpdateTRBRequestAttendee = gql`
  mutation UpdateTRBRequestAttendee($input: UpdateTRBRequestAttendeeInput!) {
    updateTRBRequestAttendee(input: $input) {
      id
      euaUserId
      trbRequestId
      component
      role
      createdAt
    }
  }
`;

/**
 * Delete TRB request attendee
 */
export const DeleteTRBRequestAttendee = gql`
  mutation DeleteTRBRequestAttendee($id: UUID!) {
    deleteTRBRequestAttendee(id: $id) {
      id
      euaUserId
      trbRequestId
      component
      role
      createdAt
    }
  }
`;
