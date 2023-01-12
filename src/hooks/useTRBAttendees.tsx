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
export default function useTRBAttendees(
  /** TRB Request ID */
  trbRequestId: string,
  /**
   * createdBy value from TRB request used for retrieving
   * requester if different from current user.
   * Not needed in TRB Request Form.
   */
  createdBy?: string
): UseTRBAttendees {
  /** Current user info from redux */
  const currentUser = useSelector((state: AppState) => state.auth);

  /**
   * Initial requester object
   */
  const initialRequester: TRBAttendeeData = useMemo(() => {
    /** Whether or not current user is the requester */
    const currentUserIsRequester: boolean = createdBy
      ? createdBy === currentUser.euaId
      : true;

    return {
      trbRequestId,
      id: '',
      component: '',
      role: null,
      userInfo: {
        // If requester is same as current user, pre-fill name
        commonName: currentUserIsRequester ? currentUser.name : '',
        // If createdBy is not provided, defaults to current user EUA
        euaUserId: createdBy || currentUser.euaId
      }
    };
  }, [trbRequestId, currentUser, createdBy]);

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
    /** Initial attendees object before data is loaded from query */
    const initialAttendeesObject: FormattedTRBAttendees = {
      requester: initialRequester,
      attendees: []
    };

    // If no attendees, return initial attendees object
    if (!attendeesArray) return initialAttendeesObject;

    /** Requester object from attendees query */
    const requesterObject: TRBAttendee | undefined = attendeesArray.find(
      attendee =>
        attendee?.userInfo?.euaUserId === initialRequester?.userInfo?.euaUserId
    );

    return {
      requester: {
        // Data from initial requester
        ...initialRequester,
        // If requester exists in attendees, add to object
        ...requesterObject
      },
      // Filter requester from attendees array
      attendees: attendeesArray.filter(
        attendee =>
          attendee?.userInfo?.euaUserId !==
          initialRequester?.userInfo?.euaUserId
      )
    };
  }, [attendeesArray, initialRequester]);

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
