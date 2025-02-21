import { useCallback, useMemo } from 'react';
import { FetchResult } from '@apollo/client';
import { initialAttendee } from 'features/TechnicalAssistance/Requester/RequestForm/Attendees';
import {
  CreateTRBRequestAttendeeInput,
  CreateTRBRequestAttendeeMutation,
  DeleteTRBRequestAttendeeMutation,
  GetTRBRequestAttendeesQuery,
  UpdateTRBRequestAttendeeInput,
  UpdateTRBRequestAttendeeMutation,
  useCreateTRBRequestAttendeeMutation,
  useDeleteTRBRequestAttendeeMutation,
  useGetTRBRequestAttendeesQuery,
  useUpdateTRBRequestAttendeeMutation
} from 'gql/generated/graphql';

type TRBAttendee =
  GetTRBRequestAttendeesQuery['trbRequest']['attendees'][number];

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
  createAttendee: (
    input: CreateTRBRequestAttendeeInput
  ) => Promise<FetchResult<CreateTRBRequestAttendeeMutation>>;
  /** Updates TRB attendee */
  updateAttendee: (
    input: UpdateTRBRequestAttendeeInput
  ) => Promise<FetchResult<UpdateTRBRequestAttendeeMutation>>;
  /** Deletes TRB attendee */
  deleteAttendee: (
    id: string
  ) => Promise<FetchResult<DeleteTRBRequestAttendeeMutation>>;
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
  const { data, loading } = useGetTRBRequestAttendeesQuery({
    variables: { id: trbRequestId }
  });

  /**
   * Array of attendees sorted by time created, with requester attendee object last
   */
  const attendees = useMemo(() => {
    if (!data?.trbRequest?.attendees) return [];

    // Sort attendees array by time created
    return [...data.trbRequest.attendees].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }, [data?.trbRequest?.attendees]);

  /** Requester object - last in attendees array when sorted by createdAt time */
  const requester: TRBAttendee | undefined = attendees[attendees.length - 1];

  /** Create attendee mutation */
  const [createAttendee] = useCreateTRBRequestAttendeeMutation({
    refetchQueries: ['GetTRBRequestAttendees']
  });

  /** Update attendee mutation */
  const [updateAttendee] = useUpdateTRBRequestAttendeeMutation({
    refetchQueries: ['GetTRBRequestAttendees']
  });

  /** Delete attendee mutation */
  const [deleteAttendee] = useDeleteTRBRequestAttendeeMutation({
    refetchQueries: ['GetTRBRequestAttendees']
  });

  return {
    data: {
      requester: requester || initialAttendee,
      attendees: loading ? [] : attendees.slice(0, attendees.length - 1),
      loading
    },
    createAttendee: useCallback(
      async input => createAttendee({ variables: { input } }),
      [createAttendee]
    ),
    updateAttendee: useCallback(
      async input => updateAttendee({ variables: { input } }),
      [updateAttendee]
    ),
    deleteAttendee: useCallback(
      async id => deleteAttendee({ variables: { id } }),
      [deleteAttendee]
    )
  };
}
