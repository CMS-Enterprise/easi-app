import { useCallback, useMemo } from 'react';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import { initialAttendee } from 'features/TechnicalAssistance/RequestForm/Attendees';
import {
  CreateTRBRequestAttendeeQuery,
  DeleteTRBRequestAttendeeQuery,
  GetTRBRequestAttendeesQuery,
  UpdateTRBRequestAttendeeQuery
} from 'gql/legacyGQL/TrbAttendeeQueries';
import {
  CreateTRBRequestAttendee,
  CreateTRBRequestAttendeeVariables
} from 'gql/legacyGQL/types/CreateTRBRequestAttendee';
import {
  DeleteTRBRequestAttendee,
  DeleteTRBRequestAttendeeVariables
} from 'gql/legacyGQL/types/DeleteTRBRequestAttendee';
import {
  GetTRBRequestAttendees,
  GetTRBRequestAttendeesVariables
} from 'gql/legacyGQL/types/GetTRBRequestAttendees';
import { TRBAttendee } from 'gql/legacyGQL/types/TRBAttendee';
import {
  UpdateTRBRequestAttendee,
  UpdateTRBRequestAttendeeVariables
} from 'gql/legacyGQL/types/UpdateTRBRequestAttendee';

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
  createAttendee: (
    input: CreateTRBRequestAttendeeInput
  ) => Promise<FetchResult<CreateTRBRequestAttendee>>;
  /** Updates TRB attendee */
  updateAttendee: (
    input: UpdateTRBRequestAttendeeInput
  ) => Promise<FetchResult<UpdateTRBRequestAttendee>>;
  /** Deletes TRB attendee */
  deleteAttendee: (
    id: string
  ) => Promise<FetchResult<DeleteTRBRequestAttendee>>;
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
  const { data, loading } = useQuery<
    GetTRBRequestAttendees,
    GetTRBRequestAttendeesVariables
  >(GetTRBRequestAttendeesQuery, {
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
  const [createAttendee] = useMutation<
    CreateTRBRequestAttendee,
    CreateTRBRequestAttendeeVariables
  >(CreateTRBRequestAttendeeQuery, {
    refetchQueries: ['GetTRBRequestAttendees']
  });

  /** Update attendee mutation */
  const [updateAttendee] = useMutation<
    UpdateTRBRequestAttendee,
    UpdateTRBRequestAttendeeVariables
  >(UpdateTRBRequestAttendeeQuery, {
    refetchQueries: ['GetTRBRequestAttendees']
  });

  /** Delete attendee mutation */
  const [deleteAttendee] = useMutation<
    DeleteTRBRequestAttendee,
    DeleteTRBRequestAttendeeVariables
  >(DeleteTRBRequestAttendeeQuery, {
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
