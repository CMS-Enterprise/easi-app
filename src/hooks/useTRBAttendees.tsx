import { useMemo } from 'react';
import { useSelector } from 'react-redux';
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
import { AppState } from 'reducers/rootReducer';
import {
  CreateTRBRequestAttendeeInput,
  UpdateTRBRequestAttendeeInput
} from 'types/graphql-global-types';
import {
  FormattedTRBAttendees,
  TRBAttendeeData
} from 'types/technicalAssistance';

/** useTRBAttendees hook return type */
type UseTRBAttendees = {
  /** Data returned from GetTRBRequestAttendees query */
  data: {
    /** Requester object */
    requester: TRBAttendeeData;
    /** Additional attendees array sorted by time created */
    attendees: TRBAttendeeData[];
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
export default function useTRBAttendees(trbRequestId: string): UseTRBAttendees {
  const requester = useSelector((state: AppState) => state.auth);

  /**
   * Query to get attendees by TRB request ID
   */
  const { data, loading } = useQuery<RequestResult>(GetTRBRequestAttendees, {
    variables: { id: trbRequestId }
  });

  /** Array of attendees sorted by time created */
  const attendeesArray = useMemo(() => {
    if (!data?.trbRequest?.attendees) return undefined;
    // Sort attendees array by time created
    return [...data.trbRequest.attendees].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }, [data?.trbRequest?.attendees]);

  /**
   * Formatted TRB attendees object
   *
   * Separates requester from additional attendees
   */
  const formattedAttendees: FormattedTRBAttendees = useMemo(() => {
    /** Empty attendees object before data is loaded from query */
    const initialAttendeesObject: FormattedTRBAttendees = {
      requester: {
        trbRequestId,
        id: '',
        component: '',
        role: null,
        userInfo: {
          commonName: requester.name,
          euaUserId: requester.euaId
        }
      },
      attendees: []
    };

    // If no attendees, return initial attendees object
    if (!attendeesArray) return initialAttendeesObject;

    /** Requester object from attendees query */
    const requesterObject: TRBAttendee | undefined = attendeesArray.find(
      attendee => attendee?.userInfo?.euaUserId === requester.euaId
    );

    return {
      requester: {
        // Data from current user
        ...initialAttendeesObject.requester,
        // If requester exists in attendees, add to object
        ...requesterObject
      },
      // Filter requester from attendees array
      attendees: attendeesArray.filter(
        attendee => attendee?.userInfo?.euaUserId !== requester.euaId
      )
    };
  }, [attendeesArray, requester, trbRequestId]);

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
    data: { ...formattedAttendees, loading },
    createAttendee,
    updateAttendee,
    deleteAttendee
  };
}
