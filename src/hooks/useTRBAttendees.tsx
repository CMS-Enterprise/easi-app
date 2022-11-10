import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';

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
import { TRBAttendeeFields, TRBAttendeesForm } from 'types/technicalAssistance';
import { initialAttendee } from 'views/TechnicalAssistance/RequestForm/Attendees';

type UseTRBAttendees = {
  data: {
    requester: TRBAttendeeFields;
    attendees: TRBAttendeeFields[];
    loading: boolean;
  };
  createAttendee: (attendee: CreateTRBRequestAttendeeInput) => void;
  updateAttendee: (attendee: UpdateTRBRequestAttendeeInput) => void;
  deleteAttendee: (id: string) => void;
};

type UseTRBAttendeesProps = {
  trbRequestId: string;
  requesterId: string;
};

type UserInfo = {
  euaUserId: string;
  commonName: string;
  email?: string;
};

/**
 * Custom hook to get, create, update, and delete TRB request attendees
 */
export default function useTRBAttendees({
  trbRequestId,
  requesterId
}: UseTRBAttendeesProps): UseTRBAttendees {
  const { authState, oktaAuth } = useOktaAuth();
  const [requester, setRequester] = useState<UserInfo>({
    euaUserId: requesterId,
    commonName: '',
    email: ''
  });

  /**
   * Query to get attendees by TRB request ID
   */
  const { data, loading } = useQuery<RequestResult>(GetTRBRequestAttendees, {
    fetchPolicy: 'cache-first',
    variables: { id: trbRequestId }
  });
  const attendeesArray = data?.trbRequest?.attendees;

  const formattedAttendees: TRBAttendeesForm = useMemo(() => {
    const initialAttendeesObject: TRBAttendeesForm = {
      requester: {
        ...initialAttendee,
        userInfo: requester
      },
      attendees: []
    };

    // If no attendees, return initial attendees object
    if (!attendeesArray) return initialAttendeesObject;

    /** Requester object from attendees query */
    const requesterObject: TRBAttendee | undefined = attendeesArray.find(
      attendee => attendee?.userInfo?.euaUserId === requester.euaUserId
    );

    return {
      requester: {
        // Data from Okta authorization
        ...initialAttendeesObject.requester,
        // If requester exists in attendees, add to object
        ...requesterObject
      },
      // Filter requester from attendees array
      attendees: attendeesArray.filter(
        attendee => attendee?.userInfo?.euaUserId !== requester.euaUserId
      )
    };
  }, [attendeesArray, requester]);

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

  // Set initial requester data
  useEffect(() => {
    let isMounted = true;
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then(({ name, email }) => {
        if (isMounted) {
          // setRequester({
          //   commonName: name || '',
          //   email,
          //   euaUserId: requesterId
          // });

          // TODO: Remove test data
          setRequester({
            commonName: 'Ashley Terstriep',
            email: 'ashley.terstriep@oddball.io',
            euaUserId: requesterId
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [authState, oktaAuth, requesterId]);

  return {
    data: { ...formattedAttendees, loading },
    createAttendee: (attendee: CreateTRBRequestAttendeeInput) =>
      createAttendee({ variables: { input: attendee } }),
    updateAttendee: (attendee: UpdateTRBRequestAttendeeInput) =>
      updateAttendee({ variables: { input: attendee } }),
    deleteAttendee: (id: string) => deleteAttendee({ variables: { id } })
  };
}
