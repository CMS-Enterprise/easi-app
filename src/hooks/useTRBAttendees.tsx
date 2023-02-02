import { useMemo } from 'react';
import {
  FetchResult,
  OperationVariables,
  useMutation,
  useQuery
} from '@apollo/client';

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

/** useTRBAttendees hook return type */
type UseTRBAttendees = {
  /** Data returned from GetTRBRequestAttendees query */
  data: {
    /** Requester object */
    requester: TRBAttendee;
    /** Additional attendees array sorted by time created */
    attendees: TRBAttendee[];
    /** GetTRBRequestAttendees query loading state */
    loading: boolean;
  };
  /** Creates new TRB attendee */
  createAttendee: (variables: OperationVariables) => Promise<FetchResult>;
  /** Updates TRB attendee */
  updateAttendee: (variables: OperationVariables) => Promise<FetchResult>;
  /** Deletes TRB attendee */
  deleteAttendee: (variables: OperationVariables) => Promise<FetchResult>;
};

/**
 * Custom hook to get, create, update, and delete TRB request attendees
 */
export default function useTRBAttendees(
  /** TRB Request ID */
  trbRequestId: string
): UseTRBAttendees {
  /**
   * Query to get attendees by TRB request ID
   */
  const { data, loading } = useQuery<RequestResult>(GetTRBRequestAttendees, {
    variables: { id: trbRequestId }
  });

  /**
   * Array of attendees sorted by time created, with requester attendee object first
   */
  const attendees = useMemo(() => {
    if (!data?.trbRequest?.attendees) return [];
    // Sort attendees array by time created
    return [...data.trbRequest.attendees].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }, [data?.trbRequest?.attendees]);

  /** Create attendee mutation */
  const [createAttendee] = useMutation<CreateTRBRequestAttendeeInput>(
    CreateTRBRequestAttendee,
    {
      refetchQueries: ['GetTRBRequestAttendees']
    }
  );

  /** Update attendee mutation */
  const [updateAttendee] = useMutation<UpdateTRBRequestAttendeeInput>(
    UpdateTRBRequestAttendee,
    {
      refetchQueries: ['GetTRBRequestAttendees']
    }
  );

  /** Delete attendee mutation */
  const [deleteAttendee] = useMutation<{ id: string }>(
    DeleteTRBRequestAttendee,
    {
      refetchQueries: ['GetTRBRequestAttendees']
    }
  );

  return {
    data: {
      requester: attendees[0],
      attendees: attendees.slice(1),
      loading
    },
    createAttendee,
    updateAttendee,
    deleteAttendee
  };
}
