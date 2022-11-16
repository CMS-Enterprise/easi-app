import { PersonRole } from './graphql-global-types';

/** TRB attendee fields allows null role in form */
export type TRBAttendeeFields = {
  id?: string;
  trbRequestId: string;
  euaUserId: string;
  component: string;
  role: PersonRole | null;
};

/** TRB attendees formatted for form */
export type TRBAttendeesForm = {
  requester: TRBAttendeeFields;
  attendees: TRBAttendeeFields[];
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
