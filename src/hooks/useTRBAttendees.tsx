import { useMutation, useQuery } from '@apollo/client';

import {
  CreateTRBRequestAttendee,
  DeleteTRBRequestAttendee,
  GetTRBRequestAttendees,
  UpdateTRBRequestAttendee
} from 'queries/TrbAttendeeQueries';
import { GetTRBRequestAttendees as RequestResult } from 'queries/types/GetTRBRequestAttendees';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import {
  CreateTRBRequestAttendeeInput,
  UpdateTRBRequestAttendeeInput
} from 'types/graphql-global-types';

type UseTRBAttendees = {
  attendees: TRBAttendee[];
  createAttendee: (attendee: CreateTRBRequestAttendeeInput) => void;
  updateAttendee: (attendee: UpdateTRBRequestAttendeeInput) => void;
  deleteAttendee: (id: string) => void;
};

/**
 * Custom hook to get, create, update, and delete TRB request attendees
 */
export default function useTRBAttendees(trbRequestId: string): UseTRBAttendees {
  /**
   * Query to get attendees by TRB request ID
   */
  const { data } = useQuery<RequestResult>(GetTRBRequestAttendees, {
    fetchPolicy: 'cache-first',
    variables: { id: trbRequestId }
  });
  const attendees: TRBAttendee[] = data?.trbRequest?.attendees || [];

  /**
   * Create TRB request attendee
   */
  const [createAttendee] = useMutation<CreateTRBRequestAttendeeInput>(
    CreateTRBRequestAttendee,
    {
      refetchQueries: ['GetTRBRequestAttendees']
    }
  );

  /**
   * Update TRB request attendee
   */
  const [updateAttendee] = useMutation<UpdateTRBRequestAttendeeInput>(
    UpdateTRBRequestAttendee,
    {
      refetchQueries: ['GetTRBRequestAttendees']
    }
  );

  /**
   * Delete TRB request attendee
   */
  const [deleteAttendee] = useMutation<{ id: string }>(
    DeleteTRBRequestAttendee,
    {
      refetchQueries: ['GetTRBRequestAttendees']
    }
  );

  return {
    attendees,
    createAttendee: (attendee: CreateTRBRequestAttendeeInput) =>
      createAttendee({ variables: { input: attendee } }),
    updateAttendee: (attendee: UpdateTRBRequestAttendeeInput) =>
      updateAttendee({ variables: { input: attendee } }),
    deleteAttendee: (id: string) => deleteAttendee({ variables: { id } })
  };
}
