import { FetchResult } from '@apollo/client';

import { PersonRole } from './graphql-global-types';

/** TRB attendee fields allows null role in form */
export type TRBAttendeeFields = {
  euaUserId: string;
  component: string;
  role: PersonRole | null;
};

/** TRB attendees formatted for form */
export type TRBAttendeesForm = {
  requester: TRBAttendeeFields;
  attendees: TRBAttendeeFields[];
};

/** Field labels */
export type AttendeeFieldLabels = {
  euaUserId: string;
  component: string;
  role: string;
  submit?: string;
};

/** TRB Attendee user info */
export type TRBAttendeeUserInfo = {
  commonName: string;
  euaUserId: string;
  email?: string;
} | null;

/** TRB Attendee object with user info */
export type TRBAttendeeData = {
  id?: string;
  trbRequestId: string;
  userInfo: TRBAttendeeUserInfo;
  component: string;
  role: PersonRole | null;
};

/** Formatted attendees for display */
export type FormattedTRBAttendees = {
  requester: TRBAttendeeData;
  attendees: TRBAttendeeData[];
};

/** Function that executes attendee mutation and handles errors */
export type SubmitFormType = (
  /** Attendee mutation, either create or update */
  mutate: (
    /** Updated attendee field values */
    attendeeFields: TRBAttendeeFields
  ) => Promise<FetchResult>,
  /** Updated attendee field values */
  formData: TRBAttendeeFields,
  /** URL to send user if successful */
  successUrl: string
) => void;
